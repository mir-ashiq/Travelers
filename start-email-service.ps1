# Email Service Starter for PowerShell
# This script starts the automatic email sending service
# Run this file or use: npm run email:start

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        🚀 JKLG Email Service Starter                   ║" -ForegroundColor Cyan
Write-Host "║       Auto-sending emails from queue                   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please create .env file with your SMTP credentials" -ForegroundColor Yellow
    Write-Host "See .env.example for template" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green

# Check if node_modules exists
if (-not (Test-Path "node_modules\nodemailer")) {
    Write-Host "❌ Missing dependencies" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installing: nodemailer @supabase/supabase-js" -ForegroundColor Yellow
    npm install nodemailer @supabase/supabase-js
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""
Write-Host "📧 Starting email sender service..." -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start the service
node start-email-service.js

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Service failed to start" -ForegroundColor Red
    exit 1
}
