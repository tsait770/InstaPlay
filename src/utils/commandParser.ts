export type VoiceCommand =
  | 'play'
  | 'pause'
  | 'forward10'
  | 'backward10'
  | 'forward30'
  | 'backward30'
  | 'volumeUp'
  | 'volumeDown'
  | 'fullscreen'
  | 'exitFullscreen'
  | 'restart'
  | 'speed'
  | 'mute'
  | 'unmute'
  | 'unknown'

interface CommandMapping {
  [key: string]: VoiceCommand
}

const COMMAND_MAPPINGS: Record<string, CommandMapping> = {
  'zh-TW': {
    '播放': 'play',
    '開始': 'play',
    '繼續': 'play',
    '暫停': 'pause',
    '停止': 'pause',
    '快轉': 'forward10',
    '快轉十秒': 'forward10',
    '前進十秒': 'forward10',
    '快轉三十秒': 'forward30',
    '前進三十秒': 'forward30',
    '快退': 'backward10',
    '快退十秒': 'backward10',
    '後退十秒': 'backward10',
    '快退三十秒': 'backward30',
    '後退三十秒': 'backward30',
    '音量加大': 'volumeUp',
    '音量增加': 'volumeUp',
    '大聲一點': 'volumeUp',
    '音量減小': 'volumeDown',
    '音量降低': 'volumeDown',
    '小聲一點': 'volumeDown',
    '全螢幕': 'fullscreen',
    '全屏': 'fullscreen',
    '退出全螢幕': 'exitFullscreen',
    '退出全屏': 'exitFullscreen',
    '重新播放': 'restart',
    '從頭開始': 'restart',
    '靜音': 'mute',
    '取消靜音': 'unmute',
  },
  'en': {
    'play': 'play',
    'start': 'play',
    'resume': 'play',
    'continue': 'play',
    'pause': 'pause',
    'stop': 'pause',
    'forward': 'forward10',
    'forward ten': 'forward10',
    'forward 10': 'forward10',
    'skip forward': 'forward10',
    'forward thirty': 'forward30',
    'forward 30': 'forward30',
    'backward': 'backward10',
    'rewind': 'backward10',
    'backward ten': 'backward10',
    'backward 10': 'backward10',
    'skip backward': 'backward10',
    'backward thirty': 'backward30',
    'backward 30': 'backward30',
    'volume up': 'volumeUp',
    'louder': 'volumeUp',
    'increase volume': 'volumeUp',
    'volume down': 'volumeDown',
    'quieter': 'volumeDown',
    'decrease volume': 'volumeDown',
    'fullscreen': 'fullscreen',
    'full screen': 'fullscreen',
    'exit fullscreen': 'exitFullscreen',
    'exit full screen': 'exitFullscreen',
    'restart': 'restart',
    'start over': 'restart',
    'from beginning': 'restart',
    'mute': 'mute',
    'unmute': 'unmute',
  },
  'ja': {
    '再生': 'play',
    '開始': 'play',
    '一時停止': 'pause',
    '停止': 'pause',
    '早送り': 'forward10',
    '巻き戻し': 'backward10',
    '音量上げる': 'volumeUp',
    '音量下げる': 'volumeDown',
    '全画面': 'fullscreen',
    '全画面解除': 'exitFullscreen',
    '最初から': 'restart',
    'ミュート': 'mute',
    'ミュート解除': 'unmute',
  },
  'ko': {
    '재생': 'play',
    '시작': 'play',
    '일시정지': 'pause',
    '정지': 'pause',
    '빨리감기': 'forward10',
    '되감기': 'backward10',
    '볼륨올리기': 'volumeUp',
    '볼륨내리기': 'volumeDown',
    '전체화면': 'fullscreen',
    '전체화면종료': 'exitFullscreen',
    '처음부터': 'restart',
    '음소거': 'mute',
    '음소거해제': 'unmute',
  },
  'es': {
    'reproducir': 'play',
    'iniciar': 'play',
    'pausar': 'pause',
    'detener': 'pause',
    'adelantar': 'forward10',
    'retroceder': 'backward10',
    'subir volumen': 'volumeUp',
    'bajar volumen': 'volumeDown',
    'pantalla completa': 'fullscreen',
    'salir pantalla completa': 'exitFullscreen',
    'reiniciar': 'restart',
    'silenciar': 'mute',
    'activar sonido': 'unmute',
  },
  'fr': {
    'jouer': 'play',
    'démarrer': 'play',
    'pause': 'pause',
    'arrêter': 'pause',
    'avancer': 'forward10',
    'reculer': 'backward10',
    'augmenter volume': 'volumeUp',
    'diminuer volume': 'volumeDown',
    'plein écran': 'fullscreen',
    'quitter plein écran': 'exitFullscreen',
    'recommencer': 'restart',
    'couper le son': 'mute',
    'réactiver le son': 'unmute',
  },
  'de': {
    'abspielen': 'play',
    'starten': 'play',
    'pause': 'pause',
    'stoppen': 'pause',
    'vorspulen': 'forward10',
    'zurückspulen': 'backward10',
    'lautstärke erhöhen': 'volumeUp',
    'lautstärke verringern': 'volumeDown',
    'vollbild': 'fullscreen',
    'vollbild verlassen': 'exitFullscreen',
    'neu starten': 'restart',
    'stumm schalten': 'mute',
    'stummschaltung aufheben': 'unmute',
  },
}

export function parseVoiceCommand(
  text: string,
  language: string = 'zh-TW'
): VoiceCommand {
  const normalizedText = text.toLowerCase().trim()

  const langCode = language.split('-')[0]
  const mapping = COMMAND_MAPPINGS[language] || COMMAND_MAPPINGS[langCode] || COMMAND_MAPPINGS['en']

  for (const [keyword, command] of Object.entries(mapping)) {
    if (normalizedText.includes(keyword.toLowerCase())) {
      return command
    }
  }

  return 'unknown'
}

export function getCommandDescription(command: VoiceCommand, language: string = 'zh-TW'): string {
  const descriptions: Record<string, Record<VoiceCommand, string>> = {
    'zh-TW': {
      play: '播放影片',
      pause: '暫停影片',
      forward10: '快轉 10 秒',
      backward10: '快退 10 秒',
      forward30: '快轉 30 秒',
      backward30: '快退 30 秒',
      volumeUp: '音量增加',
      volumeDown: '音量減小',
      fullscreen: '進入全螢幕',
      exitFullscreen: '退出全螢幕',
      restart: '重新播放',
      speed: '調整播放速度',
      mute: '靜音',
      unmute: '取消靜音',
      unknown: '未知指令',
    },
    'en': {
      play: 'Play video',
      pause: 'Pause video',
      forward10: 'Forward 10 seconds',
      backward10: 'Backward 10 seconds',
      forward30: 'Forward 30 seconds',
      backward30: 'Backward 30 seconds',
      volumeUp: 'Volume up',
      volumeDown: 'Volume down',
      fullscreen: 'Enter fullscreen',
      exitFullscreen: 'Exit fullscreen',
      restart: 'Restart video',
      speed: 'Change playback speed',
      mute: 'Mute',
      unmute: 'Unmute',
      unknown: 'Unknown command',
    },
  }

  const langDescriptions = descriptions[language] || descriptions['en']
  return langDescriptions[command] || langDescriptions['unknown']
}
