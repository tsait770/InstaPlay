import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import { bookmarkService } from '../services/bookmarkService';
import { isValidUrl } from '../utils/urlDetector';

export default function AddBookmarkScreen({ route, navigation }: any) {
  const { folderId } = route.params;
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!url.trim()) {
      Alert.alert('錯誤', '請輸入網址');
      return;
    }

    if (!isValidUrl(url)) {
      Alert.alert('錯誤', '請輸入有效的網址');
      return;
    }

    if (!title.trim()) {
      Alert.alert('錯誤', '請輸入標題');
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await bookmarkService.createBookmark(user.id, {
        url: url.trim(),
        title: title.trim(),
        folder_id: folderId,
      });

      if (error) {
        Alert.alert('錯誤', error.message);
      } else {
        Alert.alert('成功', '書籤已新增', [
          { text: '確定', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('錯誤', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>新增書籤</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveButton, loading && styles.saveButtonDisabled]}>
            儲存
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>網址 *</Text>
          <TextInput
            style={styles.input}
            placeholder="https://youtube.com/watch?v=..."
            placeholderTextColor="#64748b"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            keyboardType="url"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>標題 *</Text>
          <TextInput
            style={styles.input}
            placeholder="輸入影片標題"
            placeholderTextColor="#64748b"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.hints}>
          <Text style={styles.hintsTitle}>支援的平台：</Text>
          <Text style={styles.hint}>• YouTube, Vimeo</Text>
          <Text style={styles.hint}>• 直接媒體檔案 (.mp4, .m3u8, .mpd)</Text>
          <Text style={styles.hint}>• 串流協議 (rtmp, rtsp)</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  cancelButton: {
    fontSize: 16,
    color: '#64748b',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  saveButtonDisabled: {
    color: '#475569',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#e2e8f0',
    borderWidth: 1,
    borderColor: '#334155',
  },
  hints: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  hintsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
});
