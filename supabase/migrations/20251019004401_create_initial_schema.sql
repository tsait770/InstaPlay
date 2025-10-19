/*
  # InstaPlay Initial Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `membership_tier` (text, default 'free') - Values: 'free', 'basic', 'premium'
      - `voice_credits` (integer, default 0)
      - `referral_code` (text, unique, 6 characters)
      - `referred_by` (uuid, nullable, references users)
      - `is_admin` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `devices`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `device_id` (text, not null) - Unique device identifier
      - `device_name` (text)
      - `os_type` (text) - 'ios' or 'android'
      - `os_version` (text)
      - `last_active` (timestamptz, default now())
      - `created_at` (timestamptz, default now())

    - `voice_actions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `action_id` (text, not null) - e.g., 'play', 'pause', 'forward10'
      - `url` (text)
      - `success` (boolean, default true)
      - `created_at` (timestamptz, default now())

    - `folders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `name` (text, not null)
      - `is_hidden` (boolean, default false)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `name` (text, not null)
      - `keywords` (text array, default '{}')
      - `created_at` (timestamptz, default now())

    - `bookmarks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `folder_id` (uuid, references folders, nullable)
      - `category_id` (uuid, references categories, nullable)
      - `url` (text, not null)
      - `title` (text, not null)
      - `is_favorite` (boolean, default false)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `paypal_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `subscription_id` (text, unique, not null) - PayPal subscription ID
      - `plan_id` (text, not null) - 'basic' or 'premium'
      - `status` (text, default 'pending') - 'pending', 'active', 'cancelled'
      - `started_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz, default now())

    - `reward_claims`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users, not null)
      - `reward_type` (text, not null) - 'first_login', 'daily_login', 'referral'
      - `amount` (integer, default 0)
      - `claimed_at` (timestamptz, default now())

    - `developer_logs`
      - `id` (uuid, primary key)
      - `admin_id` (uuid, references users)
      - `action_type` (text, not null)
      - `action_details` (jsonb)
      - `ip_address` (text)
      - `created_at` (timestamptz, default now())

    - `web_dev_logs`
      - `id` (uuid, primary key)
      - `developer_id` (uuid, references users)
      - `action_type` (text, not null)
      - `action_details` (jsonb)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access only their own data
    - Add admin-only policies for developer_logs and web_dev_logs

  3. Indexes
    - Add indexes on foreign keys for performance
    - Add indexes on frequently queried columns
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  membership_tier text DEFAULT 'free' CHECK (membership_tier IN ('free', 'basic', 'premium')),
  voice_credits integer DEFAULT 0 CHECK (voice_credits >= 0),
  referral_code text UNIQUE,
  referred_by uuid REFERENCES users(id),
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id text NOT NULL,
  device_name text,
  os_type text CHECK (os_type IN ('ios', 'android', 'web')),
  os_version text,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, device_id)
);

-- Create voice_actions table
CREATE TABLE IF NOT EXISTS voice_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_id text NOT NULL,
  url text,
  success boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create folders table
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  is_hidden boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  keywords text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  url text NOT NULL,
  title text NOT NULL,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create paypal_subscriptions table
CREATE TABLE IF NOT EXISTS paypal_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id text UNIQUE NOT NULL,
  plan_id text NOT NULL CHECK (plan_id IN ('basic', 'premium')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired')),
  started_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create reward_claims table
CREATE TABLE IF NOT EXISTS reward_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_type text NOT NULL CHECK (reward_type IN ('first_login', 'daily_login', 'referral')),
  amount integer DEFAULT 0,
  claimed_at timestamptz DEFAULT now()
);

-- Create developer_logs table
CREATE TABLE IF NOT EXISTS developer_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES users(id),
  action_type text NOT NULL,
  action_details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Create web_dev_logs table
CREATE TABLE IF NOT EXISTS web_dev_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid REFERENCES users(id),
  action_type text NOT NULL,
  action_details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON devices(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_actions_user_id ON voice_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_actions_created_at ON voice_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_sort_order ON folders(user_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_folder_id ON bookmarks(folder_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_category_id ON bookmarks(category_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_favorite ON bookmarks(user_id, is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_paypal_subscriptions_user_id ON paypal_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_paypal_subscriptions_status ON paypal_subscriptions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_reward_claims_user_id ON reward_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_claims_type_date ON reward_claims(user_id, reward_type, claimed_at DESC);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE paypal_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_dev_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for devices table
CREATE POLICY "Users can view own devices"
  ON devices FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devices"
  ON devices FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices"
  ON devices FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own devices"
  ON devices FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for voice_actions table
CREATE POLICY "Users can view own voice actions"
  ON voice_actions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voice actions"
  ON voice_actions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for folders table
CREATE POLICY "Users can view own folders"
  ON folders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own folders"
  ON folders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own folders"
  ON folders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own folders"
  ON folders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for categories table
CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for bookmarks table
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for paypal_subscriptions table
CREATE POLICY "Users can view own subscriptions"
  ON paypal_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON paypal_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for reward_claims table
CREATE POLICY "Users can view own rewards"
  ON reward_claims FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rewards"
  ON reward_claims FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for developer_logs (admin only)
CREATE POLICY "Admins can view all developer logs"
  ON developer_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can insert developer logs"
  ON developer_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- RLS Policies for web_dev_logs (admin only)
CREATE POLICY "Admins can view all web dev logs"
  ON web_dev_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can insert web dev logs"
  ON web_dev_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );