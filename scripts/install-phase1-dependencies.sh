#!/bin/bash

# Phase 1: Install Dependencies Script
# This script installs all necessary packages for Payment, Security, and Customer Account features

echo "🚀 Installing Phase 1 Dependencies..."
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend

# Payment Processing
npm install stripe@latest

# Security & Validation
npm install express-rate-limit@latest helmet@latest express-validator@latest

# Authentication & Hashing
npm install jsonwebtoken@latest bcryptjs@latest

# Environment & Config
npm install dotenv@latest

# Email Templates
npm install handlebars@latest

# Utility
npm install uuid@latest axios@latest

# Development
npm install --save-dev nodemon@latest

echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../website

# Form handling & validation
npm install react-hook-form@latest zod@latest

# HTTP client
npm install axios@latest

# Notifications
npm install react-hot-toast@latest

# State management (if needed)
npm install zustand@latest

# Date/Time
npm install dayjs@latest

echo "✅ Frontend dependencies installed"
echo ""

# Update .env.example file for reference
echo "📝 Updating environment variable examples..."

cat > ../backend/.env.example << 'EOF'
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d

# Stripe Configuration (NEW)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_test_your_key

# Email Configuration
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=your_email@abctravels.site
SMTP_PASSWORD=your_email_password
SMTP_FROM=noreply@abctravels.site

# Email Verification (NEW)
EMAIL_VERIFICATION_ENABLED=true
EMAIL_VERIFICATION_EXPIRY=24h

# Security Configuration (NEW)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000

# Payment Configuration (NEW)
PAYMENT_CURRENCY=USD
PAYMENT_WEBHOOK_PATH=/api/webhooks/stripe

# Google reCAPTCHA (NEW - Optional)
RECAPTCHA_SITE_KEY=your_recaptcha_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
EOF

echo "✅ .env.example updated"
echo ""

echo "🎉 Phase 1 Dependencies Installation Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Update your .env file with the new variables"
echo "2. Get Stripe API keys from https://dashboard.stripe.com/apikeys"
echo "3. Run the database migrations"
echo "4. Review the implementation guides"
echo ""
