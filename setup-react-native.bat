@echo off
REM InstaPlay React Native Setup Script for Windows
REM 此腳本會將所有必要檔案複製到新的 Expo 專案

echo ========================================
echo 🚀 InstaPlay React Native Setup Script
echo ========================================
echo.

REM 檢查是否提供了目標目錄
if "%~1"=="" (
    echo ❌ 錯誤：請提供 InstaPlay 專案路徑
    echo 用法: setup-react-native.bat "C:\path\to\InstaPlay"
    echo.
    echo 範例: setup-react-native.bat "C:\Projects\InstaPlay"
    exit /b 1
)

set TARGET_DIR=%~1

REM 檢查目標目錄是否存在
if not exist "%TARGET_DIR%" (
    echo ❌ 錯誤：目錄不存在: %TARGET_DIR%
    echo.
    echo 請先建立 Expo 專案：
    echo npx create-expo-app InstaPlay --template expo-template-blank-typescript
    exit /b 1
)

echo 📁 目標目錄: %TARGET_DIR%
echo.

REM 複製配置檔案
echo 📋 複製配置檔案...
copy /Y "react-native\.env.example" "%TARGET_DIR%\.env" >nul
echo   ✓ .env

REM 複製 Supabase 客戶端
echo.
echo 🔧 複製 Supabase 客戶端...
if not exist "%TARGET_DIR%\lib" mkdir "%TARGET_DIR%\lib"
copy /Y "react-native\lib\supabase.ts" "%TARGET_DIR%\lib\" >nul
echo   ✓ lib\supabase.ts

REM 複製類型定義
echo.
echo 📝 複製類型定義...
if not exist "%TARGET_DIR%\types" mkdir "%TARGET_DIR%\types"
copy /Y "src\types\database.types.ts" "%TARGET_DIR%\types\" >nul
echo   ✓ types\database.types.ts

REM 複製服務層
echo.
echo ⚙️  複製服務層...
if not exist "%TARGET_DIR%\services" mkdir "%TARGET_DIR%\services"
copy /Y "src\services\*.ts" "%TARGET_DIR%\services\" >nul
echo   ✓ services\authService.ts
echo   ✓ services\userService.ts
echo   ✓ services\deviceService.ts
echo   ✓ services\voiceActionService.ts
echo   ✓ services\folderService.ts
echo   ✓ services\bookmarkService.ts
echo   ✓ services\categoryService.ts

REM 複製工具函數
echo.
echo 🔨 複製工具函數...
if not exist "%TARGET_DIR%\utils" mkdir "%TARGET_DIR%\utils"
copy /Y "src\utils\*.ts" "%TARGET_DIR%\utils\" >nul
echo   ✓ utils\urlDetector.ts
echo   ✓ utils\commandParser.ts
echo   ✓ utils\injectionScripts.ts

REM 複製 App.tsx
echo.
echo 📱 複製 App.tsx...
copy /Y "react-native\App.tsx" "%TARGET_DIR%\" >nul
echo   ✓ App.tsx

REM 複製文檔
echo.
echo 📚 複製文檔...
copy /Y "QUICK_START.md" "%TARGET_DIR%\" >nul
copy /Y "INSTAPLAY_GUIDE.md" "%TARGET_DIR%\" >nul
copy /Y "PROJECT_SUMMARY.md" "%TARGET_DIR%\" >nul
copy /Y "REACT_NATIVE_SETUP.md" "%TARGET_DIR%\" >nul
echo   ✓ QUICK_START.md
echo   ✓ INSTAPLAY_GUIDE.md
echo   ✓ PROJECT_SUMMARY.md
echo   ✓ REACT_NATIVE_SETUP.md

echo.
echo ✅ 複製完成！
echo.
echo 📂 已複製的檔案：
echo   - 配置檔案: .env
echo   - Supabase 客戶端: lib\supabase.ts
echo   - 類型定義: types\database.types.ts
echo   - 服務層: services\*.ts (7 個檔案)
echo   - 工具函數: utils\*.ts (3 個檔案)
echo   - 主程式: App.tsx
echo   - 文檔: 4 個 Markdown 檔案
echo.
echo 🎯 下一步：
echo   1. cd %TARGET_DIR%
echo   2. npm install
echo   3. npm start
echo.
echo 💡 提示：請參考 REACT_NATIVE_SETUP.md 完成剩餘配置
echo.
echo 🎊 InstaPlay 已準備就緒！
pause
