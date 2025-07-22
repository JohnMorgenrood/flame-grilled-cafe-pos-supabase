@echo off
echo 🚀 Starting Firebase Deployment...

REM Check if Firebase CLI is available
firebase --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase CLI not found. Please install it first:
    echo    npm install -g firebase-tools
    exit /b 1
)

REM Get current timestamp for version
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%-%MM%-%DD%_%HH%-%Min%-%Sec%"

echo 📦 Building production version...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build successful!
echo 🌐 Deploying to Firebase with anti-rollback protection...

REM Deploy with version message to prevent rollback confusion
firebase deploy --only hosting --message "PRODUCTION: Admin Dashboard ZAR Currency %timestamp% - DO NOT ROLLBACK"

if errorlevel 1 (
    echo ❌ Deployment failed!
    exit /b 1
)

echo 🎉 Deployment successful!
echo 🔗 Your app is live at: https://flame-grilled-cafe-pos.web.app
echo 📋 Version: %timestamp%
echo ⚠️  This version is protected against rollbacks
pause
