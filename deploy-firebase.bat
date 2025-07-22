@echo off
echo.
echo ========================================
echo   FLAME GRILLED CAFE - FIREBASE DEPLOY
echo ========================================
echo.

echo 🔨 Building the application...
call npm run build

if %ERRORLEVEL% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ✅ Build successful!
echo.

echo 🚀 Deploying to Firebase Hosting...
call firebase deploy --only hosting

if %ERRORLEVEL% neq 0 (
    echo ❌ Deployment failed!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================
echo 🎉 DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your app is now live at:
echo 🌐 https://flame-grilled-cafe-pos.web.app
echo 🌐 https://flame-grilled-cafe-pos.firebaseapp.com
echo.
echo Test the features:
echo ✅ Admin Dashboard: /admin
echo ✅ Customer Interface: /
echo ✅ Featured/Special Badges
echo ✅ 10MB Image Upload
echo ✅ Firebase Integration
echo.
pause
