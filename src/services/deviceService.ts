import { supabase } from '../lib/supabase'

export const deviceService = {
  async getDevices(userId: string) {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('user_id', userId)
      .order('last_active', { ascending: false })

    return { data, error }
  },

  async bindDevice(userId: string, deviceInfo: {
    device_id: string
    device_name?: string
    os_type?: 'ios' | 'android' | 'web'
    os_version?: string
  }) {
    const canAddDevice = await this.checkDeviceLimit(userId)

    if (!canAddDevice) {
      return {
        data: null,
        error: { message: 'Device limit reached for your membership tier' },
      }
    }

    const { data, error } = await supabase
      .from('devices')
      .upsert({
        user_id: userId,
        ...deviceInfo,
        last_active: new Date().toISOString(),
      }, {
        onConflict: 'user_id,device_id',
      })
      .select()
      .single()

    return { data, error }
  },

  async unbindDevice(deviceId: string) {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', deviceId)

    return { error }
  },

  async updateLastActive(userId: string, deviceId: string) {
    const { error } = await supabase
      .from('devices')
      .update({ last_active: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('device_id', deviceId)

    return { error }
  },

  async checkDeviceLimit(userId: string) {
    const { data, error } = await supabase.rpc('check_device_limit', {
      p_user_id: userId,
    })

    if (error) return false
    return data as boolean
  },
}
