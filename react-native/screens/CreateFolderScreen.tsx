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
import { folderService } from '../services/folderService';

export default function CreateFolderScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('錯誤', '請輸入資料夾名稱');
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await folderService.createFolder(user.id, name.trim());

      if (error) {
        Alert.alert('錯誤', error.message);
      } else {
        Alert.alert('成功', '資料夾已建立', [
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
        <Text style={styles.headerTitle}>新增資料夾</Text>
        <TouchableOpacity onPress={handleCreate} disabled={loading}>
          <Text style={[styles.createButton, loading && styles.createButtonDisabled]}>
            建立
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📁</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>資料夾名稱</Text>
          <TextInput
            style={styles.input}
            placeholder="例如：我的最愛、學習影片"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
            autoFocus
          />
        </View>

        <Text style={styles.hint}>
          建立資料夾來整理您的影片書籤
        </Text>
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
  createButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  createButtonDisabled: {
    color: '#475569',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  icon: {
    fontSize: 80,
  },
  inputContainer: {
    marginBottom: 16,
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
    fontSize: 18,
    color: '#e2e8f0',
    borderWidth: 1,
    borderColor: '#334155',
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
