# InstaPlay React Native 設置指南

## 📱 建立 React Native Expo 專案

由於網路限制，請手動執行以下步驟：

### 步驟 1: 建立 Expo 專案

在您的本地環境執行：

```bash
# 在適當的目錄中執行
npx create-expo-app InstaPlay --template expo-template-blank-typescript

# 進入專案目錄
cd InstaPlay
```

### 步驟 2: 安裝依賴套件

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

### 步驟 3: 複製專案檔案

#### 3.1 複製配置檔案

從 `react-native/` 資料夾複製以下檔案到新專案根目錄：

```bash
# 複製配置檔案
cp react-native/package.json InstaPlay/
cp react-native/app.json InstaPlay/
cp react-native/tsconfig.json InstaPlay/
cp react-native/.env.example InstaPlay/.env
```

#### 3.2 複製核心程式碼

```bash
# 複製 Supabase 客戶端（React Native 版本）
mkdir -p InstaPlay/lib
cp react-native/lib/supabase.ts InstaPlay/lib/

# 複製類型定義
mkdir -p InstaPlay/types
cp src/types/database.types.ts InstaPlay/types/

# 複製服務層
mkdir -p InstaPlay/services
cp src/services/*.ts InstaPlay/services/

# 複製工具函數
mkdir -p InstaPlay/utils
cp src/utils/*.ts InstaPlay/utils/
```

#### 3.3 更新 App.tsx

```bash
cp react-native/App.tsx InstaPlay/App.tsx
```

### 步驟 4: 配置環境變數

確保 `.env` 檔案包含正確的 Supabase 配置：

```env
EXPO_PUBLIC_SUPABASE_URL=https://zcrurkvgfaoqvgcubshg.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjcnVya3ZnZmFvcXZnY3Vic2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3OTUxNjksImV4cCI6MjA3NjM3MTE2OX0.JT-m0chQ27uuJ98N8F69FPLF0ok7HJT8hUktbOzW0bk
```

### 步驟 5: 測試專案

```bash
# 啟動開發伺服器
npm start

# 或直接在特定平台運行
npm run ios      # iOS 模擬器
npm run android  # Android 模擬器
npm run web      # 網頁版
```

---

## 📂 最終專案結構

```
InstaPlay/
├── .env
├── app.json
├── package.json
├── tsconfig.json
├── App.tsx
├── lib/
│   └── supabase.ts          (React Native 版本)
├── types/
│   └── database.types.ts
├── services/
│   ├── authService.ts
│   ├── userService.ts
│   ├── deviceService.ts
│   ├── voiceActionService.ts
│   ├── folderService.ts
│   ├── bookmarkService.ts
│   └── categoryService.ts
└── utils/
    ├── urlDetector.ts
    ├── commandParser.ts
    └── injectionScripts.ts
```

---

## 🔧 配置詳情

### app.json 重要配置

```json
{
  "expo": {
    "name": "InstaPlay",
    "slug": "instaplay",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "ios": {
      "bundleIdentifier": "com.instaplay.app"
    },
    "android": {
      "package": "com.instaplay.app"
    },
    "plugins": [
      [
        "expo-av",
        {
          "microphonePermission": "Allow InstaPlay to access your microphone for voice commands."
        }
      ]
    ]
  }
}
```

### Supabase 客戶端差異

**Web 版本** (原專案)：
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
```

**React Native 版本** (新專案)：
```typescript
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'

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

---

## ✅ 驗證檢查清單

完成設置後，請確認：

- [ ] `npm start` 可以正常啟動
- [ ] Expo Go App 可以掃描 QR Code
- [ ] App 顯示 "InstaPlay" 標題
- [ ] 沒有 TypeScript 錯誤
- [ ] 環境變數正確配置
- [ ] 所有服務層檔案已複製
- [ ] Supabase 客戶端使用 AsyncStorage

---

## 🎯 下一步開發

專案建立完成後，請參考以下文件開始開發：

1. **QUICK_START.md** - 快速開始開發
2. **INSTAPLAY_GUIDE.md** - 完整開發指南
3. **PROJECT_SUMMARY.md** - 專案架構總覽

---

## 🐛 常見問題

### Q1: 找不到模組錯誤

**解決方法**：
```bash
# 清除快取並重新安裝
rm -rf node_modules package-lock.json
npm install
```

### Q2: AsyncStorage 警告

**解決方法**：
確保已安裝並正確導入：
```bash
npm install @react-native-async-storage/async-storage
```

### Q3: Metro bundler 錯誤

**解決方法**：
```bash
# 清除 Metro 快取
npx expo start -c
```

### Q4: iOS 模擬器無法運行

**解決方法**：
```bash
# 確保 Xcode 已安裝
xcode-select --install

# 重新安裝 pods
cd ios && pod install && cd ..
```

### Q5: Android 模擬器無法運行

**解決方法**：
- 確保 Android Studio 已安裝
- 設置 ANDROID_HOME 環境變數
- 確保至少有一個 AVD (Android Virtual Device)

---

## 📞 需要幫助？

如果遇到問題，請：

1. 檢查 Expo 文檔：https://docs.expo.dev
2. 查看 React Navigation 文檔：https://reactnavigation.org
3. 參考 Supabase React Native 指南：https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native

---

## 🚀 準備就緒

完成上述步驟後，您的 InstaPlay React Native 專案就準備好了！

現在可以開始開發：
- 登入頁面
- 導航系統
- 資料夾管理
- 書籤管理
- 語音控制 UI

**所有核心邏輯（36 個 API 函數、語音解析器、URL 偵測器）都已準備好，可以直接使用！**

---

*InstaPlay - 用說的就能操作影片 🎬🎤*
