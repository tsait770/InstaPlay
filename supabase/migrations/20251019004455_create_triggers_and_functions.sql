/*
  # Database Triggers and Stored Procedures for InstaPlay

  1. Functions
    - `handle_new_user()` - Automatically create user record when auth user signs up
    - `generate_referral_code()` - Generate unique 6-character referral code
    - `decrement_voice_credits()` - Automatically deduct voice credits when action is recorded
    - `check_device_limit()` - Check if user can add more devices based on membership tier
    - `update_updated_at()` - Update updated_at timestamp on row changes

  2. Triggers
    - Auto-create user record on auth.users insert
    - Auto-deduct voice credits on voice_actions insert
    - Auto-update updated_at timestamp on users, folders, bookmarks tables

  3. Important Notes
    - Voice credits are deducted automatically when voice_actions are inserted
    - Device limits: Free=2, Basic=3, Premium=5
    - Referral codes are unique 6-character alphanumeric strings
*/

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
  code_exists boolean;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = result) INTO code_exists;
    
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, membership_tier, voice_credits, referral_code, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    0,
    generate_referral_code(),
    now(),
    now()
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create user record on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to automatically deduct voice credits
CREATE OR REPLACE FUNCTION decrement_voice_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only deduct credits for successful actions
  IF NEW.success = true THEN
    UPDATE users
    SET voice_credits = GREATEST(voice_credits - 1, 0)
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-deduct voice credits on voice action
DROP TRIGGER IF EXISTS on_voice_action_insert ON voice_actions;
CREATE TRIGGER on_voice_action_insert
  AFTER INSERT ON voice_actions
  FOR EACH ROW
  EXECUTE FUNCTION decrement_voice_credits();

-- Function to check device limit based on membership tier
CREATE OR REPLACE FUNCTION check_device_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tier text;
  device_count integer;
  max_devices integer;
BEGIN
  -- Get user's membership tier
  SELECT membership_tier INTO user_tier
  FROM users
  WHERE id = p_user_id;
  
  -- Determine max devices based on tier
  IF user_tier = 'free' THEN
    max_devices := 2;
  ELSIF user_tier = 'basic' THEN
    max_devices := 3;
  ELSIF user_tier = 'premium' THEN
    max_devices := 5;
  ELSE
    max_devices := 2; -- Default to free tier limits
  END IF;
  
  -- Count current devices
  SELECT COUNT(*) INTO device_count
  FROM devices
  WHERE user_id = p_user_id;
  
  -- Return true if user can add more devices
  RETURN device_count < max_devices;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for users table
DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for folders table
DROP TRIGGER IF EXISTS folders_updated_at ON folders;
CREATE TRIGGER folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for bookmarks table
DROP TRIGGER IF EXISTS bookmarks_updated_at ON bookmarks;
CREATE TRIGGER bookmarks_updated_at
  BEFORE UPDATE ON bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to claim first login reward
CREATE OR REPLACE FUNCTION claim_first_login_reward(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  already_claimed boolean;
BEGIN
  -- Check if user has already claimed first login reward
  SELECT EXISTS(
    SELECT 1 FROM reward_claims
    WHERE user_id = p_user_id AND reward_type = 'first_login'
  ) INTO already_claimed;
  
  IF already_claimed THEN
    RETURN false;
  END IF;
  
  -- Grant 2000 voice credits
  UPDATE users
  SET voice_credits = voice_credits + 2000
  WHERE id = p_user_id;
  
  -- Record the reward claim
  INSERT INTO reward_claims (user_id, reward_type, amount, claimed_at)
  VALUES (p_user_id, 'first_login', 2000, now());
  
  RETURN true;
END;
$$;

-- Function to claim daily login reward
CREATE OR REPLACE FUNCTION claim_daily_login_reward(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_tier text;
  reward_amount integer;
  last_claim_date date;
  today_date date;
BEGIN
  today_date := CURRENT_DATE;
  
  -- Get user's membership tier
  SELECT membership_tier INTO user_tier
  FROM users
  WHERE id = p_user_id;
  
  -- Get last daily login claim date
  SELECT DATE(claimed_at) INTO last_claim_date
  FROM reward_claims
  WHERE user_id = p_user_id AND reward_type = 'daily_login'
  ORDER BY claimed_at DESC
  LIMIT 1;
  
  -- Check if user has already claimed today
  IF last_claim_date = today_date THEN
    RETURN 0;
  END IF;
  
  -- Determine reward amount based on tier
  IF user_tier = 'premium' THEN
    reward_amount := 40;
  ELSE
    reward_amount := 30; -- Free and Basic get same amount
  END IF;
  
  -- Grant voice credits
  UPDATE users
  SET voice_credits = voice_credits + reward_amount
  WHERE id = p_user_id;
  
  -- Record the reward claim
  INSERT INTO reward_claims (user_id, reward_type, amount, claimed_at)
  VALUES (p_user_id, 'daily_login', reward_amount, now());
  
  RETURN reward_amount;
END;
$$;

-- Function to redeem referral code
CREATE OR REPLACE FUNCTION redeem_referral_code(p_user_id uuid, p_referral_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  referrer_id uuid;
  already_referred boolean;
BEGIN
  -- Check if user has already been referred
  SELECT referred_by IS NOT NULL INTO already_referred
  FROM users
  WHERE id = p_user_id;
  
  IF already_referred THEN
    RETURN false;
  END IF;
  
  -- Find the referrer
  SELECT id INTO referrer_id
  FROM users
  WHERE referral_code = p_referral_code;
  
  -- Check if referral code exists and is not user's own code
  IF referrer_id IS NULL OR referrer_id = p_user_id THEN
    RETURN false;
  END IF;
  
  -- Grant 300 credits to both users
  UPDATE users
  SET voice_credits = voice_credits + 300
  WHERE id = p_user_id OR id = referrer_id;
  
  -- Update referred_by field
  UPDATE users
  SET referred_by = referrer_id
  WHERE id = p_user_id;
  
  -- Record rewards for both users
  INSERT INTO reward_claims (user_id, reward_type, amount, claimed_at)
  VALUES
    (p_user_id, 'referral', 300, now()),
    (referrer_id, 'referral', 300, now());
  
  RETURN true;
END;
$$;

-- Function to update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status(
  p_user_id uuid,
  p_subscription_id text,
  p_plan_id text,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  bonus_credits integer;
BEGIN
  -- Update or insert subscription record
  INSERT INTO paypal_subscriptions (user_id, subscription_id, plan_id, status, started_at, created_at)
  VALUES (p_user_id, p_subscription_id, p_plan_id, p_status, now(), now())
  ON CONFLICT (subscription_id)
  DO UPDATE SET
    status = p_status,
    started_at = CASE WHEN p_status = 'active' THEN now() ELSE paypal_subscriptions.started_at END;
  
  -- Update user's membership tier if subscription is active
  IF p_status = 'active' THEN
    UPDATE users
    SET membership_tier = p_plan_id
    WHERE id = p_user_id;
    
    -- Grant bonus credits for new subscription
    IF p_plan_id = 'basic' THEN
      bonus_credits := 500;
    ELSIF p_plan_id = 'premium' THEN
      bonus_credits := 1000;
    ELSE
      bonus_credits := 0;
    END IF;
    
    IF bonus_credits > 0 THEN
      UPDATE users
      SET voice_credits = voice_credits + bonus_credits
      WHERE id = p_user_id;
    END IF;
  ELSIF p_status = 'cancelled' OR p_status = 'expired' THEN
    -- Downgrade to free tier if subscription cancelled
    UPDATE users
    SET membership_tier = 'free'
    WHERE id = p_user_id;
  END IF;
END;
$$;