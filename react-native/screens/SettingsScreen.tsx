import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { userService } from '../services/userService';
import { deviceService } from '../services/deviceService';

export default function SettingsScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profileData } = await userService.getUserProfile(user.id);
        setProfile(profileData);

        const { data: devicesData } = await deviceService.getDevices(user.id);
        setDevices(devicesData || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDailyReward = async () => {
    if (!user) return;

    const { data: amount } = await userService.claimDailyLoginReward(user.id);
    if (amount && amount > 0) {
      Alert.alert('成功', `已領取每日獎勵 +${amount} 語音額度！`);
      loadData();
    } else {
      Alert.alert('提示', '今天已經領取過每日獎勵了');
    }
  };

  const getMembershipTierName = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'basic': return 'Basic';
      case 'premium': return 'Premium';
      default: return tier;
    }
  };

  const getMembershipTierColor = (tier: string) => {
    switch (tier) {
      case 'free': return '#64748b';
      case 'basic': return '#3b82f6';
      case 'premium': return '#f59e0b';
      default: return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>設定</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {profile && (
          <>
            <View style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {user?.email?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileEmail}>{user?.email}</Text>
                  <View style={styles.membershipBadge}>
                    <Text
                      style={[
                        styles.membershipText,
                        { color: getMembershipTierColor(profile.membership_tier) },
                      ]}
                    >
                      {getMembershipTierName(profile.membership_tier)} 會員
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{profile.voice_credits}</Text>
                  <Text style={styles.statLabel}>語音額度</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{devices.length}</Text>
                  <Text style={styles.statLabel}>綁定裝置</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.rewardButton}
                onPress={handleClaimDailyReward}
              >
                <Text style={styles.rewardButtonText}>🎁 領取每日獎勵</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>會員等級說明</Text>

              <View style={styles.tierCard}>
                <Text style={styles.tierName}>Free 會員</Text>
                <Text style={styles.tierFeature}>• 2 台裝置</Text>
                <Text style={styles.tierFeature}>• 每日 +30 語音額度</Text>
              </View>

              <View style={styles.tierCard}>
                <Text style={[styles.tierName, { color: '#3b82f6' }]}>
                  Basic 會員 ($2.99/月)
                </Text>
                <Text style={styles.tierFeature}>• 3 台裝置</Text>
                <Text style={styles.tierFeature}>• 每日 +30 語音額度</Text>
                <Text style={styles.tierFeature}>• 訂閱獎勵 +500</Text>
              </View>

              <View style={styles.tierCard}>
                <Text style={[styles.tierName, { color: '#f59e0b' }]}>
                  Premium 會員 ($4.99/月)
                </Text>
                <Text style={styles.tierFeature}>• 5 台裝置</Text>
                <Text style={styles.tierFeature}>• 每日 +40 語音額度</Text>
                <Text style={styles.tierFeature}>• 訂閱獎勵 +1000</Text>
              </View>
            </View>

            {profile.referral_code && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>推薦碼</Text>
                <View style={styles.referralCard}>
                  <Text style={styles.referralCode}>{profile.referral_code}</Text>
                  <Text style={styles.referralHint}>
                    分享給朋友，雙方各獲得 300 語音額度
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>裝置管理</Text>
              {devices.map((device) => (
                <View key={device.id} style={styles.deviceCard}>
                  <Text style={styles.deviceName}>{device.device_name}</Text>
                  <Text style={styles.deviceInfo}>
                    {device.os_type} • {new Date(device.last_active).toLocaleDateString('zh-TW')}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={async () => {
            await supabase.auth.signOut();
            navigation.replace('Login');
          }}
        >
          <Text style={styles.signOutButtonText}>登出</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  backButton: {
    fontSize: 48,
    color: '#3b82f6',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileEmail: {
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 8,
  },
  membershipBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#334155',
    borderRadius: 12,
  },
  membershipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  divider: {
    width: 1,
    backgroundColor: '#334155',
  },
  rewardButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  rewardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  tierCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tierName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  tierFeature: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  referralCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  referralCode: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    letterSpacing: 4,
    marginBottom: 12,
  },
  referralHint: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  deviceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  deviceInfo: {
    fontSize: 14,
    color: '#64748b',
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
