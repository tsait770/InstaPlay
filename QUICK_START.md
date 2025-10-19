# InstaPlay 快速開始指南

## 🚀 5 分鐘快速開始

本指南將幫助您快速了解 InstaPlay 專案並開始開發。

---

## 📋 專案概述

**InstaPlay** 是一個創新的語音控制影片播放應用：
- 🎤 用語音控制影片播放
- 🌍 支援 12+ 種語言
- 📱 React Native (Expo) 移動應用
- 🗄️ Supabase 後端
- 💳 PayPal 訂閱系統

---

## ✅ 當前狀態

### 已完成（階段一）
- ✅ Supabase 資料庫架構（10 個資料表）
- ✅ Row Level Security (RLS)
- ✅ 資料庫觸發器和預存程序
- ✅ TypeScript 類型定義
- ✅ 完整的服務層 API（36 個函數）
- ✅ 語音指令解析器（12+ 語言）
- ✅ URL 類型偵測器
- ✅ Web 演示介面

---

## 🔧 現有功能測試

### 1. 查看 Web 演示

專案已包含一個功能完整的 Web 演示介面。啟動後可以：
- 測試 Google OAuth 登入
- 測試 URL 類型偵測
- 測試語音指令解析
- 查看資料庫狀態

### 2. 測試語音指令解析

```typescript
import { parseVoiceCommand } from './src/utils/commandParser'

// 中文指令
parseVoiceCommand('播放', 'zh-TW')  // 返回: 'play'
parseVoiceCommand('快轉十秒', 'zh-TW')  // 返回: 'forward10'

// 英文指令
parseVoiceCommand('pause', 'en')  // 返回: 'pause'
parseVoiceCommand('volume up', 'en')  // 返回: 'volumeUp'
```

### 3. 測試 URL 偵測

```typescript
import { detectUrlType } from './src/utils/urlDetector'

// 直接媒體檔案 → 原生播放器
detectUrlType('https://example.com/video.mp4')
// 返回: { playerType: 'native_player', isDirectMedia: true }

// YouTube 連結 → WebView
detectUrlType('https://youtube.com/watch?v=xxx')
// 返回: { playerType: 'webview', isDirectMedia: false }
```

### 4. 測試資料庫 API

```typescript
import { userService } from './src/services/userService'

// 領取首次登入獎勵
const result = await userService.claimFirstLoginReward(userId)
// 用戶獲得 +2000 語音額度

// 領取每日登入獎勵
const amount = await userService.claimDailyLoginReward(userId)
// Free/Basic 用戶 +30，Premium 用戶 +40
```

---

## 🏗️ 開始 React Native 開發

### 步驟 1: 建立新的 Expo 專案

```bash
npx create-expo-app InstaPlay --template expo-template-blank-typescript
cd InstaPlay
```

### 步驟 2: 安裝依賴

```bash
# 核心依賴
npm install @supabase/supabase-js zustand
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-url-polyfill

# 功能依賴
npm install expo-av react-native-webview
npm install @react-native-voice/voice
npm install expo-device expo-web-browser expo-auth-session
npm install react-native-gesture-handler react-native-reanimated
```

### 步驟 3: 複製核心檔案

從當前專案複製以下資料夾到新專案：

```bash
cp -r src/lib InstaPlay/src/
cp -r src/types InstaPlay/src/
cp -r src/services InstaPlay/src/
cp -r src/utils InstaPlay/src/
```

### 步驟 4: 配置環境變數

在新專案中創建 `.env` 檔案：

```env
EXPO_PUBLIC_SUPABASE_URL=https://vzamglhtudyojfokkxtq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=你的_Anon_Key
```

修改 `src/lib/supabase.ts`：

```typescript
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### 步驟 5: 建立基礎頁面

創建以下檔案：

1. **App.tsx** - 主應用入口

```typescript
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'

const Stack = createStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
```

2. **screens/LoginScreen.tsx** - 登入頁面

```typescript
import { View, Button } from 'react-native'
import { authService } from '../services/authService'

export default function LoginScreen() {
  const handleLogin = async () => {
    await authService.signInWithGoogle()
  }

  return (
    <View>
      <Button title="Google 登入" onPress={handleLogin} />
    </View>
  )
}
```

---

## 📚 重要檔案說明

### 服務層（src/services/）

| 檔案 | 功能 | 主要函數 |
|------|------|----------|
| `authService.ts` | 認證 | signInWithGoogle, signOut |
| `userService.ts` | 用戶 | getUserProfile, claimFirstLoginReward |
| `deviceService.ts` | 裝置 | bindDevice, getDevices |
| `voiceActionService.ts` | 語音操作 | recordVoiceAction, getVoiceActionStats |
| `folderService.ts` | 資料夾 | getFolders, createFolder |
| `bookmarkService.ts` | 書籤 | getBookmarks, createBookmark |
| `categoryService.ts` | 分類 | getCategories, createCategory |

### 工具函數（src/utils/）

| 檔案 | 功能 |
|------|------|
| `urlDetector.ts` | 偵測 URL 類型（WebView / 原生播放器） |
| `commandParser.ts` | 解析語音指令為動作 ID |
| `injectionScripts.ts` | 生成 WebView JavaScript 注入腳本 |

---

## 🎤 語音指令列表

### 中文指令

| 中文 | 動作 ID | 說明 |
|------|---------|------|
| 播放 / 開始 / 繼續 | play | 播放影片 |
| 暫停 / 停止 | pause | 暫停影片 |
| 快轉十秒 | forward10 | 快轉 10 秒 |
| 快退十秒 | backward10 | 快退 10 秒 |
| 快轉三十秒 | forward30 | 快轉 30 秒 |
| 快退三十秒 | backward30 | 快退 30 秒 |
| 音量加大 | volumeUp | 增加音量 |
| 音量減小 | volumeDown | 減小音量 |
| 全螢幕 / 全屏 | fullscreen | 進入全螢幕 |
| 退出全螢幕 | exitFullscreen | 退出全螢幕 |
| 重新播放 | restart | 從頭播放 |
| 靜音 | mute | 靜音 |
| 取消靜音 | unmute | 取消靜音 |

### 英文指令

| 英文 | 動作 ID |
|------|---------|
| play / start / resume | play |
| pause / stop | pause |
| forward / forward ten | forward10 |
| backward / rewind | backward10 |
| forward thirty | forward30 |
| backward thirty | backward30 |
| volume up / louder | volumeUp |
| volume down / quieter | volumeDown |
| fullscreen | fullscreen |
| exit fullscreen | exitFullscreen |
| restart | restart |
| mute | mute |
| unmute | unmute |

---

## 💾 資料庫架構速查

### 用戶相關
- `users` - 用戶資料（會員等級、語音額度、推薦碼）
- `devices` - 裝置綁定
- `reward_claims` - 獎勵領取記錄

### 內容相關
- `folders` - 資料夾
- `bookmarks` - 書籤
- `categories` - 分類

### 操作記錄
- `voice_actions` - 語音操作記錄（自動扣除額度）
- `paypal_subscriptions` - 訂閱記錄
- `developer_logs` - 開發者操作日誌
- `web_dev_logs` - Web 開發模式日誌

---

## 🔐 會員等級與限制

| 等級 | 裝置數 | 每日獎勵 | 訂閱獎勵 | 月費 |
|------|--------|----------|----------|------|
| Free | 2 | +30 | - | $0 |
| Basic | 3 | +30 | +500 | $2.99 |
| Premium | 5 | +40 | +1000 | $4.99 |

---

## 🎁 獎勵系統

| 獎勵類型 | 額度 | 條件 |
|----------|------|------|
| 首次登入 | +2000 | 第一次登入 |
| 每日登入 | +30/40 | 每天登入一次 |
| 推薦好友 | +300 | 輸入推薦碼（雙方） |
| Basic 訂閱 | +500 | 訂閱 Basic 方案 |
| Premium 訂閱 | +1000 | 訂閱 Premium 方案 |

---

## 🔍 常見問題

### Q1: 如何配置 Google OAuth？

1. 前往 Supabase Dashboard
2. 進入 Authentication > Providers
3. 啟用 Google Provider
4. 設定 Google Client ID 和 Secret
5. 添加 Redirect URLs

### Q2: 如何測試語音額度系統？

使用 SQL 手動設定額度：
```sql
UPDATE users SET voice_credits = 10000 WHERE id = 'user_id';
```

### Q3: 如何查看語音操作記錄？

```sql
SELECT * FROM voice_actions
WHERE user_id = 'user_id'
ORDER BY created_at DESC
LIMIT 100;
```

### Q4: 如何重設每日登入獎勵？

```sql
DELETE FROM reward_claims
WHERE user_id = 'user_id' AND reward_type = 'daily_login';
```

---

## 📖 更多資源

- 📘 **INSTAPLAY_GUIDE.md** - 完整開發指南
- 📊 **PROJECT_SUMMARY.md** - 專案總結與統計
- 🗄️ **Supabase Dashboard** - 資料庫管理介面

---

## 🚦 開發階段路線圖

### ✅ 階段一：基礎架構（已完成）
- 資料庫設計與建立
- 服務層 API
- 工具函數庫
- Web 演示介面

### 🚧 階段二：React Native UI（進行中）
- Google OAuth 登入
- 導航系統
- 資料夾與書籤管理
- 語音控制 UI

### ⏳ 階段三：核心功能
- 語音辨識整合
- WebView 播放器
- 原生播放器
- 語音指令執行

### ⏳ 階段四：進階功能
- PayPal 訂閱
- 推薦碼系統
- 五星評價
- 統計圖表

### ⏳ 階段五：上架準備
- 後台管理系統
- 國際化
- 法律文件
- 應用商店提交

---

## 💡 開發提示

1. **使用現有的服務函數** - 不要重複造輪子
2. **遵循 RLS 策略** - 確保資料安全
3. **測試獎勵系統** - 防止重複領取
4. **處理錯誤情況** - 網路錯誤、權限拒絕等
5. **參考 Web 演示** - 了解功能如何運作

---

## 🎯 下一步建議

1. **立即可做**
   - 測試現有的 Web 演示介面
   - 了解語音指令解析器
   - 熟悉資料庫結構

2. **本週目標**
   - 初始化 Expo 專案
   - 建立基礎導航
   - 實作登入頁面

3. **未來兩週**
   - 完成資料夾與書籤 UI
   - 整合語音辨識
   - 實作播放器

---

## 📞 需要幫助？

- 查看 `INSTAPLAY_GUIDE.md` 獲取詳細說明
- 檢查 Supabase 文檔
- 參考現有的服務函數實作

---

**準備好開始了嗎？** 🚀

```bash
# 開始建立您的 InstaPlay App
npx create-expo-app InstaPlay --template expo-template-blank-typescript
```

---

*InstaPlay - 用說的就能操作影片 🎬🎤*
