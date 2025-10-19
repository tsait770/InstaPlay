# InstaPlay - 語音控制影片播放 App

## 專案概述

InstaPlay 是一個創新的影片語音控制應用程式，允許用戶透過語音指令控制影片播放。本專案已完成以下核心架構：

- ✅ 完整的 Supabase 資料庫架構（10 個資料表）
- ✅ Row Level Security (RLS) 安全策略
- ✅ 資料庫觸發器與預存程序
- ✅ TypeScript 類型定義
- ✅ 完整的服務層 API
- ✅ 語音指令解析器（支援 12+ 語言）
- ✅ URL 類型偵測器
- ✅ JavaScript 注入腳本生成器
- ✅ Web 演示介面

## 資料庫架構

### 主要資料表

1. **users** - 用戶資料
   - 會員等級 (free/basic/premium)
   - 語音額度追蹤
   - 推薦碼系統

2. **devices** - 裝置管理
   - 裝置綁定與追蹤
   - 依會員等級限制數量

3. **voice_actions** - 語音操作記錄
   - 自動扣除語音額度
   - 操作成功率追蹤

4. **folders** - 資料夾管理
   - 書籤分類
   - 隱藏/顯示功能

5. **bookmarks** - 書籤管理
   - URL 儲存
   - 最愛功能
   - 分類標籤

6. **categories** - 分類系統
   - 自訂分類
   - 關鍵字陣列

7. **paypal_subscriptions** - 訂閱管理
   - PayPal 整合
   - 訂閱狀態追蹤

8. **reward_claims** - 獎勵系統
   - 首次登入獎勵 (+2000)
   - 每日登入獎勵 (+30/40)
   - 推薦獎勵 (+300)

## 核心功能

### 1. 語音指令系統

支援的語音指令：
- **播放/暫停**: play, pause
- **快轉/快退**: forward10, backward10, forward30, backward30
- **音量控制**: volumeUp, volumeDown, mute, unmute
- **全螢幕**: fullscreen, exitFullscreen
- **其他**: restart, speed

支援語言：
- 繁體中文、英文、日文、韓文、西班牙文、法文、德文等 12+ 種語言

### 2. URL 類型偵測

自動偵測 URL 類型並選擇適當的播放器：
- **原生播放器**: .mp4, .m3u8, .mpd 等直接媒體檔案
- **WebView 播放器**: YouTube, Vimeo 等網頁嵌入影片

### 3. 會員系統

三種會員等級：
- **Free**: 2 台裝置，每日 +30 語音額度
- **Basic**: 3 台裝置，每日 +30 語音額度，訂閱獎勵 +500
- **Premium**: 5 台裝置，每日 +40 語音額度，訂閱獎勵 +1000

### 4. 獎勵機制

- 首次登入：+2000 語音額度
- 每日登入：+30 或 +40（依會員等級）
- 推薦好友：雙方各 +300

## 專案結構

```
project/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Supabase 客戶端配置
│   ├── types/
│   │   └── database.types.ts     # 資料庫 TypeScript 類型
│   ├── services/
│   │   ├── authService.ts        # 認證服務
│   │   ├── userService.ts        # 用戶服務
│   │   ├── deviceService.ts      # 裝置服務
│   │   ├── voiceActionService.ts # 語音操作服務
│   │   ├── folderService.ts      # 資料夾服務
│   │   ├── bookmarkService.ts    # 書籤服務
│   │   └── categoryService.ts    # 分類服務
│   ├── utils/
│   │   ├── urlDetector.ts        # URL 類型偵測
│   │   ├── commandParser.ts      # 語音指令解析
│   │   └── injectionScripts.ts   # JavaScript 注入腳本
│   └── App.tsx                   # Web 演示介面
└── .env                          # 環境變數
```

## Supabase 配置

已配置的資料庫：
- **URL**: https://vzamglhtudyojfokkxtq.supabase.co
- **環境變數**: 已設定在 .env 檔案中

### 資料庫功能

#### 觸發器
1. `handle_new_user()` - 自動建立用戶記錄
2. `decrement_voice_credits()` - 自動扣除語音額度
3. `update_updated_at()` - 自動更新時間戳

#### 預存程序
1. `check_device_limit(user_id)` - 檢查裝置限制
2. `claim_first_login_reward(user_id)` - 領取首次登入獎勵
3. `claim_daily_login_reward(user_id)` - 領取每日登入獎勵
4. `redeem_referral_code(user_id, code)` - 兌換推薦碼
5. `update_subscription_status(...)` - 更新訂閱狀態

## 遷移到 React Native

### 步驟 1: 建立 Expo 專案

```bash
npx create-expo-app InstaPlay --template expo-template-blank-typescript
cd InstaPlay
```

### 步驟 2: 安裝依賴

```bash
# 核心依賴
npm install @supabase/supabase-js
npm install zustand
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# 額外功能
npm install expo-av                      # 影片播放器
npm install react-native-webview         # WebView 播放器
npm install @react-native-voice/voice    # 語音辨識
npm install expo-device                  # 裝置資訊
npm install expo-web-browser             # OAuth 登入
npm install expo-auth-session            # OAuth 登入
npm install react-native-gesture-handler # 手勢控制
npm install react-native-reanimated      # 動畫
```

### 步驟 3: 複製核心檔案

將以下資料夾複製到新專案：
- `src/lib/` → 複製到 React Native 專案
- `src/types/` → 複製到 React Native 專案
- `src/services/` → 複製到 React Native 專案
- `src/utils/` → 複製到 React Native 專案

### 步驟 4: 配置環境變數

在 React Native 專案中創建 `.env` 檔案：

```env
EXPO_PUBLIC_SUPABASE_URL=https://vzamglhtudyojfokkxtq.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

修改 `src/lib/supabase.ts` 以使用 Expo 的環境變數：

```typescript
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### 步驟 5: 建立導航結構

創建以下頁面：
- `LoginScreen.tsx` - 登入頁面
- `HomeScreen.tsx` - 首頁（資料夾列表）
- `PlayerScreen.tsx` - 播放器頁面
- `BookmarksScreen.tsx` - 書籤列表
- `SettingsScreen.tsx` - 設定頁面

### 步驟 6: 實作核心組件

1. **語音控制組件** (`FloatingMicButton.tsx`)
   - 浮動麥克風按鈕
   - 語音辨識啟動
   - 即時文字顯示

2. **播放器組件**
   - `WebViewPlayer.tsx` - WebView 播放器
   - `NativePlayer.tsx` - 原生播放器

3. **書籤管理組件**
   - `FolderCard.tsx` - 資料夾卡片
   - `BookmarkCard.tsx` - 書籤卡片

### 步驟 7: 配置 Google OAuth

在 Supabase Dashboard:
1. 前往 Authentication > Providers
2. 啟用 Google Provider
3. 設定 Client ID 和 Secret
4. 添加 Redirect URLs（Expo 的 redirect scheme）

## API 使用範例

### 用戶認證

```typescript
import { authService } from './services/authService'

// 登入
const { data, error } = await authService.signInWithGoogle()

// 獲取當前用戶
const { user } = await authService.getCurrentUser()

// 登出
await authService.signOut()
```

### 語音操作記錄

```typescript
import { voiceActionService } from './services/voiceActionService'

// 記錄語音操作（自動扣除額度）
await voiceActionService.recordVoiceAction(
  userId,
  'play',
  'https://example.com/video.mp4',
  true
)

// 獲取統計資料
const { stats } = await voiceActionService.getVoiceActionStats(userId)
```

### 書籤管理

```typescript
import { bookmarkService } from './services/bookmarkService'

// 創建書籤
await bookmarkService.createBookmark(userId, {
  url: 'https://youtube.com/watch?v=xxx',
  title: '精彩影片',
  folder_id: folderId,
})

// 獲取書籤
const { data } = await bookmarkService.getBookmarks(userId, folderId)

// 切換最愛
await bookmarkService.toggleFavorite(bookmarkId, true)
```

### 獎勵系統

```typescript
import { userService } from './services/userService'

// 領取首次登入獎勵
const { data } = await userService.claimFirstLoginReward(userId)

// 領取每日登入獎勵
const { data: amount } = await userService.claimDailyLoginReward(userId)

// 兌換推薦碼
const { data: success } = await userService.redeemReferralCode(userId, 'ABC123')
```

## 開發階段

### 已完成 ✅
- [x] 資料庫架構設計與建立
- [x] RLS 安全策略實作
- [x] 資料庫觸發器與預存程序
- [x] TypeScript 類型定義
- [x] 完整的服務層 API
- [x] 語音指令解析器
- [x] URL 類型偵測器
- [x] Web 演示介面

### 待開發 🚧

**階段二：使用者身份與安全模組**
- [ ] Google OAuth 登入整合（React Native）
- [ ] 裝置 ID 獲取與綁定
- [ ] 裝置管理介面
- [ ] 獎勵系統 UI

**階段三：核心功能 - 語音控制與播放器**
- [ ] 平台語音辨識整合
- [ ] 語音控制 UI 設計
- [ ] WebView 播放器實作
- [ ] 原生播放器實作
- [ ] 語音指令執行邏輯

**階段四：書籤與支付模組**
- [ ] 資料夾管理 UI
- [ ] 書籤管理 UI
- [ ] 批次操作功能
- [ ] PayPal 訂閱整合
- [ ] 推薦碼 UI

**階段五：開發者模式與國際化**
- [ ] 後台管理系統
- [ ] 國際化框架
- [ ] 錯誤處理機制
- [ ] 應用商店上架準備

## 技術棧

- **前端框架**: React Native (Expo)
- **狀態管理**: Zustand
- **資料庫**: Supabase (PostgreSQL)
- **認證**: Supabase Auth (Google OAuth)
- **支付**: PayPal Subscriptions
- **語音辨識**: @react-native-voice/voice
- **影片播放**: expo-av, react-native-webview
- **導航**: React Navigation

## 安全性

- ✅ Row Level Security (RLS) 已啟用所有資料表
- ✅ 用戶只能存取自己的資料
- ✅ 管理員功能受保護
- ✅ 語音額度自動扣除與驗證
- ✅ 裝置數量限制
- ✅ 推薦碼防重複兌換

## 測試建議

### 資料庫測試
1. 測試用戶註冊自動觸發器
2. 測試語音額度自動扣除
3. 測試 RLS 策略防止跨用戶訪問
4. 測試裝置限制邏輯
5. 測試獎勵系統防重複領取

### 功能測試
1. 測試語音指令解析準確度
2. 測試 URL 類型偵測
3. 測試 JavaScript 注入執行
4. 測試書籤 CRUD 操作
5. 測試訂閱流程

## 常見問題

### Q: 如何重設語音額度？
A: 使用 SQL 直接更新：
```sql
UPDATE users SET voice_credits = 10000 WHERE id = 'user_id';
```

### Q: 如何手動觸發獎勵？
A: 使用 Supabase Function：
```sql
SELECT claim_first_login_reward('user_id');
SELECT claim_daily_login_reward('user_id');
```

### Q: 如何查看語音操作記錄？
A: 查詢 voice_actions 表：
```sql
SELECT * FROM voice_actions
WHERE user_id = 'user_id'
ORDER BY created_at DESC
LIMIT 100;
```

## 聯絡與支援

如有任何問題，請查閱以下資源：
- Supabase 文檔: https://supabase.com/docs
- React Native 文檔: https://reactnative.dev
- Expo 文檔: https://docs.expo.dev

---

**InstaPlay** - 用說的就能操作影片 🎬🎤
