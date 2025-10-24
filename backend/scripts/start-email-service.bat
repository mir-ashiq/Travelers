@echo off
REM Email Service Starter for Windows
REM This script starts the automatic email sending service
REM Run this file or use: npm run email:start

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║        🚀 JKLG Email Service Starter                   ║
echo ║       Auto-sending emails from queue                   ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ❌ ERROR: .env file not found!
    echo.
    echo Please create .env file with your SMTP credentials
    echo See .env.example for template
    echo.
    pause
    exit /b 1
)

echo ✅ .env file found
echo.

REM Check if node_modules exists
if not exist "node_modules\nodemailer" (
    echo ❌ Missing dependencies
    echo.
    echo Installing: nodemailer @supabase/supabase-js
    call npm install nodemailer @supabase/supabase-js
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo ✅ Dependencies installed
echo.
echo 📧 Starting email sender service...
echo    Press Ctrl+C to stop
echo.

REM Start the service
node start-email-service.js

if errorlevel 1 (
    echo.
    echo ❌ Service failed to start
    pause
    exit /b 1
)

pause
