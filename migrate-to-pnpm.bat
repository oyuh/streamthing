@echo off
echo 🚀 Starting migration from npm to pnpm...

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing pnpm globally...
    call npm install -g pnpm
) else (
    echo ✅ pnpm is already installed
)

REM Remove node_modules and package-lock.json
echo 🧹 Cleaning up npm artifacts...
if exist node_modules (
    rmdir /s /q node_modules
    echo   ✓ Removed node_modules
)

if exist package-lock.json (
    del package-lock.json
    echo   ✓ Removed package-lock.json
) else (
    echo   ✓ No package-lock.json found
)

REM Install dependencies with pnpm
echo 📦 Installing dependencies with pnpm...
call pnpm install

REM Done
echo.
echo ✅ Migration complete! You can now use pnpm commands:
echo   • pnpm dev          - Start development server
echo   • pnpm build        - Build for production
echo   • pnpm start        - Start production server
echo   • pnpm add ^<pkg^>    - Add a dependency
echo.
echo 🔍 Remember to commit the pnpm-lock.yaml file to your repository
echo 🎵 Your Streamthing project is now using pnpm! 🎉

pause
