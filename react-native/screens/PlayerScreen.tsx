import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { Video, ResizeMode } from 'expo-av';
import Voice from '@react-native-voice/voice';
import { supabase } from '../lib/supabase';
import { voiceActionService } from '../services/voiceActionService';
import { parseVoiceCommand, getCommandDescription } from '../utils/commandParser';
import { detectUrlType } from '../utils/urlDetector';
import { generateInjectionScript } from '../utils/injectionScripts';

const { width, height } = Dimensions.get('window');

export default function PlayerScreen({ route, navigation }: any) {
  const { bookmark } = route.params;
  const videoRef = useRef<any>(null);
  const webViewRef = useRef<any>(null);

  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [lastCommand, setLastCommand] = useState('');

  const urlInfo = detectUrlType(bookmark.url);
  const isNativePlayer = urlInfo.playerType === 'native_player';

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechEnd = onSpeechEnd;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: any) => {
    if (e.value && e.value[0]) {
      const text = e.value[0];
      setVoiceText(text);
      handleVoiceCommand(text);
    }
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const startListening = async () => {
    try {
      setVoiceText('');
      setIsListening(true);
      await Voice.start('zh-TW');
    } catch (error: any) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('錯誤', '無法啟動語音辨識');
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error: any) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const handleVoiceCommand = async (text: string) => {
    const command = parseVoiceCommand(text, 'zh-TW');
    const description = getCommandDescription(command, 'zh-TW');

    setLastCommand(description);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await voiceActionService.recordVoiceAction(
        user.id,
        command,
        bookmark.url,
        true
      );
    }

    if (isNativePlayer) {
      executeNativeCommand(command);
    } else {
      executeWebViewCommand(command);
    }

    setTimeout(() => setLastCommand(''), 3000);
  };

  const executeNativeCommand = async (command: string) => {
    if (!videoRef.current) return;

    try {
      switch (command) {
        case 'play':
          await videoRef.current.playAsync();
          break;
        case 'pause':
          await videoRef.current.pauseAsync();
          break;
        case 'forward10':
          const statusForward = await videoRef.current.getStatusAsync();
          await videoRef.current.setPositionAsync(
            statusForward.positionMillis + 10000
          );
          break;
        case 'backward10':
          const statusBackward = await videoRef.current.getStatusAsync();
          await videoRef.current.setPositionAsync(
            Math.max(0, statusBackward.positionMillis - 10000)
          );
          break;
        case 'restart':
          await videoRef.current.setPositionAsync(0);
          await videoRef.current.playAsync();
          break;
      }
    } catch (error) {
      console.error('Error executing native command:', error);
    }
  };

  const executeWebViewCommand = (command: string) => {
    if (!webViewRef.current) return;

    const script = generateInjectionScript(command);
    webViewRef.current.injectJavaScript(script);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" hidden />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {bookmark.title}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.playerContainer}>
        {isNativePlayer ? (
          <Video
            ref={videoRef}
            source={{ uri: bookmark.url }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
          />
        ) : (
          <WebView
            ref={webViewRef}
            source={{ uri: bookmark.url }}
            style={styles.webView}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
        )}
      </View>

      {lastCommand ? (
        <View style={styles.commandFeedback}>
          <Text style={styles.commandText}>{lastCommand}</Text>
        </View>
      ) : null}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.micButton,
            isListening && styles.micButtonActive,
          ]}
          onPress={isListening ? stopListening : startListening}
          onLongPress={startListening}
        >
          <Text style={styles.micIcon}>🎤</Text>
          {isListening && (
            <View style={styles.listeningIndicator}>
              <Text style={styles.listeningText}>聆聽中...</Text>
            </View>
          )}
        </TouchableOpacity>

        {voiceText ? (
          <View style={styles.voiceTextContainer}>
            <Text style={styles.voiceText}>{voiceText}</Text>
          </View>
        ) : null}

        <View style={styles.hints}>
          <Text style={styles.hintsTitle}>語音指令範例：</Text>
          <View style={styles.hintsList}>
            <Text style={styles.hint}>播放 • 暫停 • 快轉十秒</Text>
            <Text style={styles.hint}>快退十秒 • 重新播放</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  playerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  commandFeedback: {
    position: 'absolute',
    top: 120,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.95)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  commandText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  micButtonActive: {
    backgroundColor: '#ef4444',
  },
  micIcon: {
    fontSize: 40,
  },
  listeningIndicator: {
    position: 'absolute',
    bottom: -24,
  },
  listeningText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  voiceTextContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  voiceText: {
    fontSize: 16,
    color: '#3b82f6',
    textAlign: 'center',
  },
  hints: {
    alignItems: 'center',
  },
  hintsTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  hintsList: {
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
});
