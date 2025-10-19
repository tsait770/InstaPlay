# InstaPlay

> 語音控制影片播放 - 用說的就能操作 🎬🎤

[![Status](https://img.shields.io/badge/Status-Phase_1_Complete-success)](https://github.com)
[![Database](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)
[![Framework](https://img.shields.io/badge/Framework-React_Native-blue)](https://reactnative.dev)
[![Language](https://img.shields.io/badge/Language-TypeScript-blue)](https://www.typescriptlang.org)

## 📖 專案簡介

InstaPlay 是一個創新的影片語音控制應用程式，讓用戶可以透過語音指令輕鬆控制影片播放。無論是 YouTube、Vimeo 或直接媒體檔案，只要說出指令，就能實現播放、暫停、快轉、調整音量等操作。

### ✨ 核心特色

- 🎤 **語音控制** - 支援 12+ 種語言的語音指令
- 🌐 **多平台支援** - YouTube、Vimeo、直接媒體檔案
- 🎯 **智能偵測** - 自動選擇最佳播放器（WebView / 原生）
- 💎 **會員系統** - Free、Basic、Premium 三種方案
- 🎁 **獎勵機制** - 首次登入、每日登入、推薦好友獎勵
- 📱 **裝置管理** - 依會員等級限制綁定裝置數量
- 💳 **PayPal 整合** - 訂閱支付系統
- 🔒 **資料安全** - Row Level Security 完整保護

## 🚀 快速開始

### 查看文檔

- 📘 [**完整開發指南**](./INSTAPLAY_GUIDE.md) - 詳細的開發文檔
- ⚡ [**快速開始指南**](./QUICK_START.md) - 5 分鐘快速上手
- 📊 [**專案總結**](./PROJECT_SUMMARY.md) - 完整的專案統計

### 當前狀態

✅ **階段一已完成** - 核心架構與後端建設

```
✅ Supabase 資料庫架構（10 個資料表）
✅ Row Level Security (RLS) 安全策略
✅ 資料庫觸發器與預存程序
✅ TypeScript 完整類型定義
✅ 服務層 API（36 個函數）
✅ 語音指令解析器（12+ 語言）
✅ URL 類型偵測器
✅ Web 演示介面
```

### Web 演示

專案包含一個功能完整的 Web 演示介面，展示核心功能：

```bash
# 如果依賴已安裝，直接啟動
npm run dev

# 開啟瀏覽器訪問
# http://localhost:5173
```

## 🏗️ 技術架構

### 後端
- **資料庫**: Supabase (PostgreSQL)
- **認證**: Supabase Auth (Google OAuth)
- **安全性**: Row Level Security (RLS)
- **觸發器**: 自動扣除語音額度、自動創建用戶

### 前端（計劃）
- **框架**: React Native (Expo)
- **狀態管理**: Zustand
- **導航**: React Navigation
- **語音辨識**: @react-native-voice/voice
- **影片播放**: expo-av, react-native-webview

### 支付
- **訂閱系統**: PayPal Subscriptions
- **Webhook**: Supabase Edge Functions

## 📊 專案統計

| 項目 | 數量 |
|------|------|
| 資料表 | 10 個 |
| 觸發器 | 3 個 |
| 預存程序 | 5 個 |
| API 函數 | 36 個 |
| 支援語言 | 12+ 種 |
| 語音指令 | 13 種 |
| 程式碼行數 | 2,266 行 |

## 🗄️ 資料庫架構

### 核心資料表

```
users                   用戶資料（會員等級、語音額度、推薦碼）
├── devices            裝置綁定記錄
├── voice_actions      語音操作記錄（自動扣除額度）
├── folders            資料夾管理
├── bookmarks          書籤管理
├── categories         分類系統
├── paypal_subscriptions  訂閱記錄
├── reward_claims      獎勵領取記錄
├── developer_logs     開發者操作日誌
└── web_dev_logs       Web 開發模式日誌
```

## 🎤 語音指令

### 支援的操作

| 操作 | 中文指令 | 英文指令 |
|------|----------|----------|
| 播放 | 播放 / 開始 / 繼續 | play / start / resume |
| 暫停 | 暫停 / 停止 | pause / stop |
| 快轉 | 快轉十秒 / 快轉三十秒 | forward ten / forward thirty |
| 快退 | 快退十秒 / 快退三十秒 | backward ten / backward thirty |
| 音量 | 音量加大 / 音量減小 | volume up / volume down |
| 全螢幕 | 全螢幕 / 退出全螢幕 | fullscreen / exit fullscreen |
| 其他 | 重新播放 / 靜音 | restart / mute |

### 支援的語言

繁體中文 • 英文 • 日文 • 韓文 • 西班牙文 • 法文 • 德文 • 義大利文 • 葡萄牙文 • 俄文 • 阿拉伯文 • 印地文

## 💎 會員方案

| 方案 | 裝置限制 | 每日獎勵 | 訂閱獎勵 | 月費 |
|------|----------|----------|----------|------|
| **Free** | 2 台 | +30 | - | $0 |
| **Basic** | 3 台 | +30 | +500 | $2.99 |
| **Premium** | 5 台 | +40 | +1000 | $4.99 |

## 🎁 獎勵系統

- 🎉 **首次登入**: +2,000 語音額度
- 📅 **每日登入**: +30/40 語音額度（依會員等級）
- 👥 **推薦好友**: 雙方各 +300 語音額度
- 💎 **訂閱獎勵**: Basic +500 / Premium +1000

## 🔐 安全性

- ✅ **Row Level Security (RLS)** - 所有資料表啟用
- ✅ **資料隔離** - 用戶只能存取自己的資料
- ✅ **自動驗證** - 觸發器自動檢查與執行
- ✅ **權限控制** - 管理員功能受保護
- ✅ **額度保護** - 防止負數與重複領取

## 📁 專案結構

```
project/
├── src/
│   ├── lib/                  Supabase 客戶端配置
│   ├── types/                TypeScript 類型定義
│   ├── services/             API 服務層（7 個模組）
│   ├── utils/                工具函數（URL 偵測、指令解析）
│   └── App.tsx              Web 演示介面
├── .env                      環境變數
├── README.md                 本文件
├── QUICK_START.md            快速開始指南
├── INSTAPLAY_GUIDE.md        完整開發指南
└── PROJECT_SUMMARY.md        專案總結
```

## 🛠️ 開發路線圖

### ✅ 階段一：基礎架構（已完成）
- [x] Supabase 資料庫設計與建立
- [x] Row Level Security 實作
- [x] 資料庫觸發器與預存程序
- [x] TypeScript 類型定義
- [x] 服務層 API 開發
- [x] 工具函數庫
- [x] Web 演示介面

### 🚧 階段二：React Native UI
- [ ] Expo 專案初始化
- [ ] Google OAuth 登入整合
- [ ] 導航系統建立
- [ ] 資料夾與書籤管理 UI
- [ ] 裝置管理介面
- [ ] 設定頁面

### ⏳ 階段三：核心功能
- [ ] 語音辨識整合
- [ ] 語音控制 UI
- [ ] WebView 播放器
- [ ] 原生播放器
- [ ] JavaScript 注入執行
- [ ] 語音操作記錄

### ⏳ 階段四：進階功能
- [ ] PayPal 訂閱整合
- [ ] 推薦碼系統 UI
- [ ] 五星評價引導
- [ ] 統計圖表
- [ ] 批次操作

### ⏳ 階段五：上架準備
- [ ] 後台管理系統
- [ ] 國際化翻譯
- [ ] App 圖標與啟動畫面
- [ ] 應用截圖與影片
- [ ] 法律文件
- [ ] App Store 提交

## 🔧 API 使用範例

### 用戶認證

```typescript
import { authService } from './src/services/authService'

// Google 登入
await authService.signInWithGoogle()

// 獲取當前用戶
const { user } = await authService.getCurrentUser()

// 登出
await authService.signOut()
```

### 語音操作記錄

```typescript
import { voiceActionService } from './src/services/voiceActionService'

// 記錄語音操作（自動扣除 1 個語音額度）
await voiceActionService.recordVoiceAction(
  userId,
  'play',
  'https://youtube.com/watch?v=xxx',
  true
)
```

### 獎勵系統

```typescript
import { userService } from './src/services/userService'

// 領取首次登入獎勵（+2000）
await userService.claimFirstLoginReward(userId)

// 領取每日登入獎勵（+30 或 +40）
await userService.claimDailyLoginReward(userId)

// 兌換推薦碼（雙方各 +300）
await userService.redeemReferralCode(userId, 'ABC123')
```

## 🌐 Supabase 連線

專案已配置 Supabase 連線：

- **Project URL**: `https://vzamglhtudyojfokkxtq.supabase.co`
- **環境變數**: 已設定在 `.env` 檔案
- **資料庫**: 10 個資料表已建立
- **RLS**: 全部啟用
- **觸發器**: 已配置並運行

## 📝 授權

本專案為私有專案，未授權不得使用。

## 👥 貢獻

目前不接受外部貢獻。

## 📞 支援

如需協助，請查閱：
- [完整開發指南](./INSTAPLAY_GUIDE.md)
- [快速開始指南](./QUICK_START.md)
- [專案總結](./PROJECT_SUMMARY.md)

---

<div align="center">
  <h3>InstaPlay - 用說的就能操作影片</h3>
  <p>🎬 語音控制 • 🌍 多語言 • 📱 跨平台 • 🔒 安全可靠</p>
  <p><strong>Phase 1 Complete ✅ | Ready for React Native Development</strong></p>
</div>
