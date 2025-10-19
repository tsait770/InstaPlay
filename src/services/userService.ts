import { supabase } from '../lib/supabase'

export const userService = {
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    return { data, error }
  },

  async updateUserProfile(userId: string, updates: {
    membership_tier?: 'free' | 'basic' | 'premium'
    voice_credits?: number
  }) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  },

  async claimFirstLoginReward(userId: string) {
    const { data, error } = await supabase.rpc('claim_first_login_reward', {
      p_user_id: userId,
    })

    return { data, error }
  },

  async claimDailyLoginReward(userId: string) {
    const { data, error } = await supabase.rpc('claim_daily_login_reward', {
      p_user_id: userId,
    })

    return { data, error }
  },

  async redeemReferralCode(userId: string, referralCode: string) {
    const { data, error } = await supabase.rpc('redeem_referral_code', {
      p_user_id: userId,
      p_referral_code: referralCode,
    })

    return { data, error }
  },
}
