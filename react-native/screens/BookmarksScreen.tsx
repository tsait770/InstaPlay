import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { bookmarkService } from '../services/bookmarkService';
import { extractDomain } from '../utils/urlDetector';

export default function BookmarksScreen({ route, navigation }: any) {
  const { folderId, folderName } = route.params;
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await bookmarkService.getBookmarks(user.id, folderId);
      if (data) {
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookmarks();
    setRefreshing(false);
  };

  const handleToggleFavorite = async (bookmarkId: string, isFavorite: boolean) => {
    await bookmarkService.toggleFavorite(bookmarkId, !isFavorite);
    await loadBookmarks();
  };

  const renderBookmark = ({ item }: any) => {
    const domain = extractDomain(item.url);

    return (
      <TouchableOpacity
        style={styles.bookmarkCard}
        onPress={() => navigation.navigate('Player', { bookmark: item })}
      >
        <View style={styles.bookmarkHeader}>
          <View style={styles.bookmarkIcon}>
            <Text style={styles.bookmarkIconText}>🎬</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(item.id, item.is_favorite)}
          >
            <Text style={styles.favoriteIcon}>
              {item.is_favorite ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.bookmarkTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.bookmarkFooter}>
          <Text style={styles.bookmarkDomain} numberOfLines={1}>
            {domain}
          </Text>
          <Text style={styles.bookmarkDate}>
            {new Date(item.created_at).toLocaleDateString('zh-TW')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{folderName}</Text>
          <Text style={styles.headerSubtitle}>
            {bookmarks.length} 個書籤
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
        keyExtractor={(item) => item.id}
        numColumns={2}
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
            <Text style={styles.emptyIcon}>🔖</Text>
            <Text style={styles.emptyText}>還沒有書籤</Text>
            <Text style={styles.emptySubtext}>點擊右下角按鈕新增書籤</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddBookmark', { folderId })}
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
  backButton: {
    fontSize: 48,
    color: '#3b82f6',
    fontWeight: '300',
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  bookmarkCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 180,
  },
  bookmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookmarkIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIconText: {
    fontSize: 24,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
    minHeight: 40,
  },
  bookmarkFooter: {
    marginTop: 'auto',
  },
  bookmarkDomain: {
    fontSize: 12,
    color: '#3b82f6',
    marginBottom: 4,
  },
  bookmarkDate: {
    fontSize: 12,
    color: '#64748b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    width: '100%',
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
