# Firebase Deployment Script with Version Control
# This script prevents rollbacks by using specific deployment messages

Write-Host "🚀 Starting Firebase Deployment..." -ForegroundColor Green

# Check if user is logged in
$loginStatus = firebase login:list 2>&1
if ($loginStatus -match "No authorized accounts") {
    Write-Host "⚠️  Please log in to Firebase first:" -ForegroundColor Yellow
    Write-Host "   firebase login" -ForegroundColor Cyan
    exit 1
}

# Get current timestamp for deployment version
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$version = "v1.0_admin_dashboard_$timestamp"

Write-Host "📦 Building production version..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    
    # Deploy with version message to prevent rollback confusion
    Write-Host "🌐 Deploying to Firebase with version: $version" -ForegroundColor Blue
    firebase deploy --only hosting --message "PRODUCTION RELEASE: Complete Admin Dashboard with ZAR Currency & Category Management - $version - DO NOT ROLLBACK"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🎉 Deployment successful!" -ForegroundColor Green
        Write-Host "🔗 Your app is live at: https://flame-grilled-cafe-pos.web.app" -ForegroundColor Cyan
        Write-Host "📋 Version deployed: $version" -ForegroundColor Yellow
        Write-Host "⚠️  To prevent rollbacks, this version is marked as PRODUCTION RELEASE" -ForegroundColor Red
    } else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
}
