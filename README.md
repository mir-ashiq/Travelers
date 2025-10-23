# JKLG Travel - Production Ready Travel Agency Platform

A modern, feature-rich travel agency web application built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Frontend

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Hero Carousel**: Beautiful image carousel for destinations
- **Destination Showcase**: Featured destinations with detailed descriptions
- **Package Management**: Browse and filter travel packages
- **Gallery**: Beautiful photo gallery with lightbox
- **Testimonials**: Customer testimonials slider
- **Contact Form**: Professional contact form with validation
- **SEO Optimized**: Meta tags and structured data ready
- **Analytics Ready**: Google Analytics integration points

### Admin Panel

- **Dashboard**: Analytics and quick stats
- **Destination Management**: CRUD operations for destinations
- **Package Management**: Create and manage travel packages
- **Booking Management**: View and manage all bookings
- **User Management**: Admin user management with role-based access
- **Gallery Management**: Upload and manage gallery images
- **Testimonials**: Moderate and manage customer testimonials
- **Blog**: Create and publish blog posts
- **FAQ & Support**: FAQ management and support ticket system
- **Reports**: Analytics and performance reports
- **Settings**: System configuration and preferences

### Security Features

- **Authentication**: JWT token-based authentication
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Client-side and server-side validation
- **XSS Prevention**: HTML sanitization
- **CSRF Protection**: Token validation
- **Rate Limiting**: API rate limiting ready
- **Secure Storage**: Encrypted sensitive data storage

### Developer Experience

- **TypeScript**: Full type safety throughout
- **Custom Hooks**: Reusable logic with custom React hooks
- **Error Boundary**: Automatic error catching and recovery
- **Logging Service**: Production-ready logging
- **Error Handling**: Comprehensive error handling
- **API Client**: Interceptors and retry logic
- **Environment Config**: Easy environment management

## 📋 Prerequisites

- Node.js 16+
- npm or yarn
- Git

## 🔧 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd travelers
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_VERSION=1.0.0
```

## 🏃 Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Demo Credentials

- Email: `admin@jklgtravel.com`
- Password: `admin123`

## 🏗 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── common/         # Shared UI components
│   ├── home/           # Home page sections
│   └── layout/         # Layout components
├── contexts/           # React context for state management
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── api.ts          # API client
│   ├── errors.ts       # Error classes
│   ├── logger.ts       # Logging service
│   ├── supabase.ts     # Supabase configuration
│   └── validation.ts   # Validation utilities
├── pages/              # Page components
├── admin/              # Admin panel pages
└── App.tsx             # Root component
```

## 📦 Built With

### Core

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router 6** - Client-side routing
- **Tailwind CSS 3** - Styling

### Libraries

- **Supabase** - Backend as a Service
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Slick** - Carousels
- **DayJS** - Date handling

### Development

- **Vite** - Build tool
- **ESLint** - Code linting
- **TypeScript** - Type checking

## 🔐 Security

### Authentication Flow

1. User logs in with email/password
2. JWT token is generated and stored
3. Token is automatically refreshed
4. Requests include Bearer token in Authorization header
5. Logout clears token and user session

### Best Practices

- Never store sensitive data in localStorage without encryption
- Always use HTTPS in production
- Implement rate limiting on backend
- Validate all inputs
- Use Content Security Policy headers
- Keep dependencies updated

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

Output files will be in `dist/` directory

### Environment Setup

```env
# Production
VITE_ENVIRONMENT=production
VITE_API_BASE_URL=https://api.jklgtravel.com/api
VITE_SENTRY_DSN=your-sentry-dsn
VITE_GA_TRACKING_ID=your-ga-id
```

### Deployment Options

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Build
npm run build

# Deploy using Netlify CLI or drag-and-drop dist/ folder
netlify deploy --prod --dir dist
```

#### Docker

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Traditional Server (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/travelers/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend-api:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
}
```

## 📊 Performance Optimization

- Code splitting for faster initial load
- Image optimization with lazy loading
- Caching strategy with service workers
- Minification and tree-shaking
- Font optimization

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
npm run lint -- --fix
```

## 📚 API Documentation

### Authentication

```
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
POST /api/auth/refresh
```

### Packages

```
GET /api/packages - List all packages
GET /api/packages/:id - Get package details
POST /api/packages - Create new package (admin)
PUT /api/packages/:id - Update package (admin)
DELETE /api/packages/:id - Delete package (admin)
```

### Bookings

```
GET /api/bookings - List bookings
POST /api/bookings - Create booking
GET /api/bookings/:id - Get booking details
PUT /api/bookings/:id - Update booking status
```

### See `.env.example` for all configuration options

## 🐛 Troubleshooting

### Issue: Module not found

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port already in use

```bash
npm run dev -- --port 5174
```

### Issue: Supabase connection error

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- Check Supabase project is running
- Verify CORS settings in Supabase

## 📞 Support

For issues and questions:

1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Contact: support@jklgtravel.com

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com)
- [Vite](https://vitejs.dev)

---

**Last Updated**: October 23, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
