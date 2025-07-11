@echo off
echo Installing Node.js Backend Dependencies...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

echo NPM version:
npm --version
echo.

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.

echo Setting up Husky git hooks...
npx husky install

echo.
echo Creating logs directory...
if not exist "logs" mkdir logs

echo.
echo Setup complete! You can now:
echo   1. Copy .env.example to .env and configure your environment
echo   2. Start development server with: npm run dev
echo   3. Run tests with: npm test
echo   4. Build for production with: npm run build
echo.

pause
