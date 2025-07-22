@echo off
echo === Quick Deploy Check ===
echo.

echo Checking npm...
npm --version
if errorlevel 1 (
    echo NPM not working
    pause
    exit
)

echo Checking firebase...
npx firebase --version
if errorlevel 1 (
    echo Firebase CLI not working
    pause
    exit
)

echo Running build with timeout...
timeout /t 30 npm run build
if errorlevel 1 (
    echo Build timed out or failed
    pause
    exit
)

echo Deploying...
npx firebase deploy --only hosting
echo.
echo Done!
pause
