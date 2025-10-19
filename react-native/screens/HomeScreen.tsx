import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { folderService } from '../services/folderService';
import { userService } from '../services/userService';

export default function HomeScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [voiceCredits, setVoiceCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUser();
    loadFolders();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadUserProfile(session.user.id);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  const loadUserProfile = async (userId: string) => {
    const { data } = await userService.getUserProfile(userId);
    if (data) {
      setVoiceCredits(data.voice_credits);
    }
  };

  const loadFolders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await folderService.getFolders(user.id);
      if (data) {
        setFolders(data);
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFolders();
    if (user) {
      await loadUserProfile(user.id);
    }
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigation.replace('Login');
  };

  const renderFolder = ({ item }: any) => (
    <TouchableOpacity
      style={styles.folderCard}
      onPress={() => navigation.navigate('Bookmarks', { folderId: item.id, folderName: item.name })}
    >
      <View style={styles.folderIcon}>
        <Text style={styles.folderIconText}>📁</Text>
      </View>
      <View style={styles.folderInfo}>
        <Text style={styles.folderName}>{item.name}</Text>
        <Text style={styles.folderDate}>
          {new Date(item.created_at).toLocaleDateString('zh-TW')}
        </Text>
      </View>
      <Text style={styles.folderArrow}>›</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>InstaPlay</Text>
          <Text style={styles.headerSubtitle}>我的資料夾</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOutButton}>登出</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.creditsCard}>
        <View style={styles.creditsInfo}>
          <Text style={styles.creditsLabel}>語音額度</Text>
          <Text style={styles.creditsValue}>{voiceCredits}</Text>
        </View>
        <TouchableOpacity
          style={styles.creditsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.creditsButtonText}>查看詳情</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={folders}
        renderItem={renderFolder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyText}>還沒有資料夾</Text>
            <Text style={styles.emptySubtext}>點擊右下角按鈕建立第一個資料夾</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateFolder')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  signOutButton: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '600',
  },
  creditsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  creditsInfo: {
    flex: 1,
  },
  creditsLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  creditsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  creditsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#334155',
    borderRadius: 8,
  },
  creditsButtonText: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  folderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  folderIconText: {
    fontSize: 24,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  folderDate: {
    fontSize: 14,
    color: '#64748b',
  },
  folderArrow: {
    fontSize: 32,
    color: '#475569',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
});
