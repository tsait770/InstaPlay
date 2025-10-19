import { supabase } from '../lib/supabase'

export const voiceActionService = {
  async recordVoiceAction(
    userId: string,
    actionId: string,
    url?: string,
    success: boolean = true
  ) {
    const { data, error } = await supabase
      .from('voice_actions')
      .insert({
        user_id: userId,
        action_id: actionId,
        url,
        success,
      })
      .select()
      .single()

    return { data, error }
  },

  async getVoiceActions(userId: string, limit: number = 100) {
    const { data, error } = await supabase
      .from('voice_actions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    return { data, error }
  },

  async getVoiceActionStats(userId: string) {
    const { data, error } = await supabase
      .from('voice_actions')
      .select('action_id, success, created_at')
      .eq('user_id', userId)

    if (error) return { stats: null, error }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)

    const todayActions = data?.filter(
      (action) => new Date(action.created_at) >= today
    ).length || 0

    const monthActions = data?.filter(
      (action) => new Date(action.created_at) >= thisMonth
    ).length || 0

    const totalActions = data?.length || 0
    const successfulActions = data?.filter((action) => action.success).length || 0
    const successRate = totalActions > 0 ? (successfulActions / totalActions) * 100 : 0

    return {
      stats: {
        today: todayActions,
        thisMonth: monthActions,
        total: totalActions,
        successRate: Math.round(successRate),
      },
      error: null,
    }
  },
}
