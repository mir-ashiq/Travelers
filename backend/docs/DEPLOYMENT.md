# Deployment Guide

This guide covers production deployment strategies for the JKLG Travel application.

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Tests passing
- [ ] Code reviewed and merged
- [ ] Dependencies updated and audited
- [ ] Build successful (`npm run build`)
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] SSL/TLS certificate ready
- [ ] Backup strategy in place

## Environment Configuration

### Production Environment Variables

```env
# App
VITE_ENVIRONMENT=production
VITE_APP_NAME=JKLG Travel
VITE_APP_VERSION=1.0.0

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# API
VITE_API_BASE_URL=https://api.jklgtravel.com/api
VITE_API_TIMEOUT=30000

# Security
VITE_CSRF_TOKEN_HEADER=X-CSRF-Token
VITE_MAX_LOGIN_ATTEMPTS=5
VITE_SESSION_TIMEOUT=3600000

# Analytics & Monitoring
VITE_SENTRY_DSN=https://your-sentry-key@sentry.io/project-id
VITE_GA_TRACKING_ID=G-YOUR-TRACKING-ID
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
```

## Deployment Platforms

### 1. Vercel (Recommended for Vite + React)

**Advantages:**

- Zero-config deployment
- Automatic SSL
- CDN included
- Preview deployments
- Easy environment management

**Steps:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**vercel.json configuration:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "VITE_API_BASE_URL": "@api_base_url"
  }
}
```

### 2. Netlify

**Steps:**

```bash
# Build
npm run build

# Option A: CLI Deploy
npm i -g netlify-cli
netlify deploy --prod --dir dist

# Option B: Connect GitHub
# 1. Go to Netlify.com
# 2. New site from Git
# 3. Select repository
# 4. Set build command: npm run build
# 5. Set publish directory: dist
# 6. Deploy
```

**netlify.toml:**

```toml
[build]
command = "npm run build"
publish = "dist"

[build.environment]
NODE_VERSION = "18"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### 3. GitHub Pages

```bash
# Update vite.config.ts
# base: '/travelers/'

npm run build
# Deploy dist/ folder to gh-pages branch
```

### 4. Docker + Docker Compose

**Dockerfile:**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**docker-compose.yml:**

```yaml
version: "3.8"

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
      - VITE_API_BASE_URL=${VITE_API_BASE_URL}
    restart: unless-stopped
    labels:
      - "com.example.description=Travel Agency Frontend"
```

**Deploy:**

```bash
docker build -t travel-agency:latest .
docker run -p 3000:3000 --env-file .env.production travel-agency:latest
```

### 5. Traditional Server (Nginx + Ubuntu)

**Server Setup:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

**Nginx Configuration:**

```nginx
# /etc/nginx/sites-available/jklgtravel

upstream travel_app {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;
    gzip_min_length 1000;

    root /var/www/travel/dist;

    # Static files cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend-api:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /\.env {
        deny all;
    }
}
```

**Enable site:**

```bash
sudo ln -s /etc/nginx/sites-available/jklgtravel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**SSL Certificate (Let's Encrypt):**

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

**Deploy with PM2:**

```bash
# Clone repo
git clone <repo-url> /var/www/travel
cd /var/www/travel

# Install dependencies
npm ci

# Build
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'travel-frontend',
    script: 'npx serve -s dist -l 3000',
    watch: false,
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

## Performance Optimization

### 1. Enable Caching Headers

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          router: ["react-router-dom"],
          supabase: ["@supabase/supabase-js"],
        },
      },
    },
  },
};
```

### 2. Image Optimization

```bash
# Install image optimization tool
npm install -D imagemin imagemin-mozjpeg imagemin-pngquant

# Optimize images
npx imagemin src/assets/images --out-dir=optimized-images
```

### 3. Monitoring Performance

```javascript
// src/lib/performance.ts
if (import.meta.env.VITE_GA_TRACKING_ID) {
  // Web Vitals
  import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
}
```

## Monitoring & Logging

### Sentry Setup

```typescript
// src/lib/sentry.ts
import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT,
    tracesSampleRate: 0.1,
    integrations: [new Sentry.Replay()],
  });
}
```

### Error Tracking

```typescript
// Errors automatically logged
logger.error("Critical error", error);
```

## Backup & Disaster Recovery

### Database Backup

```bash
# Supabase automatic backups (included in plans)
# Manual backup:
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore:
psql $DATABASE_URL < backup-20251023.sql
```

### Application Backup

```bash
# Backup dist folder
tar -czf backup-dist-$(date +%Y%m%d).tar.gz dist/

# Backup to cloud storage
aws s3 cp backup-dist-*.tar.gz s3://my-backups/
```

## Post-Deployment

- [ ] Test all features
- [ ] Verify analytics tracking
- [ ] Check error tracking
- [ ] Monitor performance
- [ ] Test mobile responsiveness
- [ ] Verify SEO
- [ ] Test API endpoints
- [ ] Load test

## Rollback Procedure

```bash
# Vercel
vercel rollback

# Netlify
# Use deploy history in dashboard

# Docker
docker run -p 3000:3000 travel-agency:previous

# Traditional
git revert <commit-hash>
npm run build
sudo systemctl restart travel-frontend
```

## Continuous Integration/Deployment (CI/CD)

See `.github/workflows/` for GitHub Actions workflows.

---

**Last Updated**: October 23, 2025
