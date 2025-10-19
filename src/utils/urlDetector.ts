export type PlayerType = 'native_player' | 'webview'

export interface UrlDetectionResult {
  playerType: PlayerType
  url: string
  isDirectMedia: boolean
}

const DIRECT_MEDIA_EXTENSIONS = [
  '.mp4',
  '.m3u8',
  '.mpd',
  '.mov',
  '.avi',
  '.mkv',
  '.webm',
  '.flv',
  '.wmv',
  '.m4v',
]

const STREAMING_PROTOCOLS = [
  'rtmp://',
  'rtsp://',
  'mms://',
  'mmsh://',
]

export function detectUrlType(url: string): UrlDetectionResult {
  const lowercaseUrl = url.toLowerCase().trim()

  if (!lowercaseUrl.startsWith('http://') && !lowercaseUrl.startsWith('https://') && !lowercaseUrl.startsWith('rtmp://') && !lowercaseUrl.startsWith('rtsp://')) {
    if (!lowercaseUrl.includes('://')) {
      url = 'https://' + url
    }
  }

  const isDirectMedia = DIRECT_MEDIA_EXTENSIONS.some((ext) =>
    lowercaseUrl.includes(ext)
  ) || STREAMING_PROTOCOLS.some((protocol) =>
    lowercaseUrl.startsWith(protocol)
  )

  const playerType: PlayerType = isDirectMedia ? 'native_player' : 'webview'

  return {
    playerType,
    url,
    isDirectMedia,
  }
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    if (url.includes('.') && !url.includes(' ')) {
      return true
    }
    return false
  }
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return ''
  }
}
