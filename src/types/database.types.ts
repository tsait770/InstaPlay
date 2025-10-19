export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          membership_tier: 'free' | 'basic' | 'premium'
          voice_credits: number
          referral_code: string | null
          referred_by: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          membership_tier?: 'free' | 'basic' | 'premium'
          voice_credits?: number
          referral_code?: string | null
          referred_by?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          membership_tier?: 'free' | 'basic' | 'premium'
          voice_credits?: number
          referral_code?: string | null
          referred_by?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      devices: {
        Row: {
          id: string
          user_id: string
          device_id: string
          device_name: string | null
          os_type: 'ios' | 'android' | 'web' | null
          os_version: string | null
          last_active: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_id: string
          device_name?: string | null
          os_type?: 'ios' | 'android' | 'web' | null
          os_version?: string | null
          last_active?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_id?: string
          device_name?: string | null
          os_type?: 'ios' | 'android' | 'web' | null
          os_version?: string | null
          last_active?: string
          created_at?: string
        }
      }
      voice_actions: {
        Row: {
          id: string
          user_id: string
          action_id: string
          url: string | null
          success: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action_id: string
          url?: string | null
          success?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action_id?: string
          url?: string | null
          success?: boolean
          created_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          user_id: string
          name: string
          is_hidden: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          is_hidden?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          is_hidden?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          keywords: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          keywords?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          keywords?: string[]
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          folder_id: string | null
          category_id: string | null
          url: string
          title: string
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          folder_id?: string | null
          category_id?: string | null
          url: string
          title: string
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          folder_id?: string | null
          category_id?: string | null
          url?: string
          title?: string
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      paypal_subscriptions: {
        Row: {
          id: string
          user_id: string
          subscription_id: string
          plan_id: 'basic' | 'premium'
          status: 'pending' | 'active' | 'cancelled' | 'expired'
          started_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subscription_id: string
          plan_id: 'basic' | 'premium'
          status?: 'pending' | 'active' | 'cancelled' | 'expired'
          started_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subscription_id?: string
          plan_id?: 'basic' | 'premium'
          status?: 'pending' | 'active' | 'cancelled' | 'expired'
          started_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      reward_claims: {
        Row: {
          id: string
          user_id: string
          reward_type: 'first_login' | 'daily_login' | 'referral'
          amount: number
          claimed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_type: 'first_login' | 'daily_login' | 'referral'
          amount?: number
          claimed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reward_type?: 'first_login' | 'daily_login' | 'referral'
          amount?: number
          claimed_at?: string
        }
      }
      developer_logs: {
        Row: {
          id: string
          admin_id: string | null
          action_type: string
          action_details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id?: string | null
          action_type: string
          action_details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string | null
          action_type?: string
          action_details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
      web_dev_logs: {
        Row: {
          id: string
          developer_id: string | null
          action_type: string
          action_details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          developer_id?: string | null
          action_type: string
          action_details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          developer_id?: string | null
          action_type?: string
          action_details?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_device_limit: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      claim_first_login_reward: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
      }
      claim_daily_login_reward: {
        Args: {
          p_user_id: string
        }
        Returns: number
      }
      redeem_referral_code: {
        Args: {
          p_user_id: string
          p_referral_code: string
        }
        Returns: boolean
      }
      update_subscription_status: {
        Args: {
          p_user_id: string
          p_subscription_id: string
          p_plan_id: string
          p_status: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
