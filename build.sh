#!/bin/bash

# Build script for Koyeb deployment
# This builds the React app and prepares the backend

set -e

echo "📦 Building React website..."
cd website
npm install
npm run build
cd ..

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "✅ Build complete!"
