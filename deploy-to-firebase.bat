@echo off
echo ============================================
echo 🚀 DEPLOYING PAYMENT SYSTEM TO FIREBASE
echo ============================================
echo.

cd /d "c:\Users\VALERIE\Desktop\flammedgrilledcafe"

echo 📦 Building production version...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo ✅ Build completed successfully!
echo.

echo 🌐 Deploying to Firebase hosting...
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ❌ Deployment failed!
    pause
    exit /b 1
)

echo.
echo ✅ DEPLOYMENT SUCCESSFUL!
echo 🌐 Your payment system is now live at:
echo    https://flame-grilled-cafe-pos.web.app
echo.
echo 📱 Test the payment-first ordering system:
echo    1. Navigate to the mobile ordering section
echo    2. Add items to cart
echo    3. Click "Place Order" 
echo    4. PaymentModal will open (no cash option)
echo    5. Complete payment to get order code
echo.
pause
