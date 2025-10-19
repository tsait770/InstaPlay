#!/bin/bash

# InstaPlay React Native Setup Script
# 此腳本會將所有必要檔案複製到新的 Expo 專案

echo "🚀 InstaPlay React Native Setup Script"
echo "========================================"
echo ""

# 檢查是否提供了目標目錄
if [ -z "$1" ]; then
    echo "❌ 錯誤：請提供 InstaPlay 專案路徑"
    echo "用法: ./setup-react-native.sh /path/to/InstaPlay"
    echo ""
    echo "範例: ./setup-react-native.sh ~/Projects/InstaPlay"
    exit 1
fi

TARGET_DIR="$1"

# 檢查目標目錄是否存在
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ 錯誤：目錄不存在: $TARGET_DIR"
    echo ""
    echo "請先建立 Expo 專案："
    echo "npx create-expo-app InstaPlay --template expo-template-blank-typescript"
    exit 1
fi

echo "📁 目標目錄: $TARGET_DIR"
echo ""

# 複製配置檔案
echo "📋 複製配置檔案..."
cp react-native/.env.example "$TARGET_DIR/.env"
echo "  ✓ .env"

# 複製 Supabase 客戶端（React Native 版本）
echo ""
echo "🔧 複製 Supabase 客戶端..."
mkdir -p "$TARGET_DIR/lib"
cp react-native/lib/supabase.ts "$TARGET_DIR/lib/"
echo "  ✓ lib/supabase.ts"

# 複製類型定義
echo ""
echo "📝 複製類型定義..."
mkdir -p "$TARGET_DIR/types"
cp src/types/database.types.ts "$TARGET_DIR/types/"
echo "  ✓ types/database.types.ts"

# 複製服務層
echo ""
echo "⚙️  複製服務層..."
mkdir -p "$TARGET_DIR/services"
cp src/services/*.ts "$TARGET_DIR/services/"
echo "  ✓ services/authService.ts"
echo "  ✓ services/userService.ts"
echo "  ✓ services/deviceService.ts"
echo "  ✓ services/voiceActionService.ts"
echo "  ✓ services/folderService.ts"
echo "  ✓ services/bookmarkService.ts"
echo "  ✓ services/categoryService.ts"

# 複製工具函數
echo ""
echo "🔨 複製工具函數..."
mkdir -p "$TARGET_DIR/utils"
cp src/utils/*.ts "$TARGET_DIR/utils/"
echo "  ✓ utils/urlDetector.ts"
echo "  ✓ utils/commandParser.ts"
echo "  ✓ utils/injectionScripts.ts"

# 複製 App.tsx
echo ""
echo "📱 複製 App.tsx..."
cp react-native/App.tsx "$TARGET_DIR/"
echo "  ✓ App.tsx"

# 複製文檔
echo ""
echo "📚 複製文檔..."
cp QUICK_START.md "$TARGET_DIR/"
cp INSTAPLAY_GUIDE.md "$TARGET_DIR/"
cp PROJECT_SUMMARY.md "$TARGET_DIR/"
cp REACT_NATIVE_SETUP.md "$TARGET_DIR/"
echo "  ✓ QUICK_START.md"
echo "  ✓ INSTAPLAY_GUIDE.md"
echo "  ✓ PROJECT_SUMMARY.md"
echo "  ✓ REACT_NATIVE_SETUP.md"

echo ""
echo "✅ 複製完成！"
echo ""
echo "📂 已複製的檔案："
echo "  - 配置檔案: .env"
echo "  - Supabase 客戶端: lib/supabase.ts"
echo "  - 類型定義: types/database.types.ts"
echo "  - 服務層: services/*.ts (7 個檔案)"
echo "  - 工具函數: utils/*.ts (3 個檔案)"
echo "  - 主程式: App.tsx"
echo "  - 文檔: 4 個 Markdown 檔案"
echo ""
echo "🎯 下一步："
echo "  1. cd $TARGET_DIR"
echo "  2. npm install"
echo "  3. npm start"
echo ""
echo "💡 提示：請參考 REACT_NATIVE_SETUP.md 完成剩餘配置"
echo ""
echo "🎊 InstaPlay 已準備就緒！"
