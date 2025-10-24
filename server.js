#!/usr/bin/env node

/**
 * Production Server
 * Starts both:
 * 1. Express server for the website (port 3000)
 * 2. Email sender service (background process)
 * 
 * This ensures emails are sent automatically on every deployment
 * Usage: node server.js
 */

import express from 'express';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const PROJECT_ROOT = __dirname;
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

console.log(`
╔════════════════════════════════════════════════════════╗
║         🚀 JKLG Travel Agency Production Server       ║
║                                                        ║
║  Website: http://localhost:${PORT}                 ║
║  Email Service: Running automatically                ║
╚════════════════════════════════════════════════════════╝
`);

/**
 * Serve static files (built React app)
 */
app.use(express.static(DIST_DIR));

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Email status endpoint
 */
app.get('/api/email-status', (req, res) => {
  res.json({
    status: emailServiceRunning ? 'running' : 'stopped',
    timestamp: new Date().toISOString(),
  });
});

/**
 * SPA fallback - serve index.html for all routes
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

/**
 * Start Email Service in Background
 */
let emailServiceProcess = null;
let emailServiceRunning = false;

function startEmailService() {
  console.log('📧 Starting email service...\n');

  // Check if .env exists
  if (!fs.existsSync(path.join(PROJECT_ROOT, '.env'))) {
    console.warn('⚠️  .env file not found. Email service will not start.');
    console.warn('   Create .env with SMTP credentials for auto-email sending.\n');
    return;
  }

  // Check if dependencies are installed
  const emailSenderPath = path.join(PROJECT_ROOT, 'email-sender.js');
  if (!fs.existsSync(emailSenderPath)) {
    console.warn('⚠️  email-sender.js not found. Email service will not start.\n');
    return;
  }

  // Spawn email sender as child process
  emailServiceProcess = spawn('node', [emailSenderPath], {
    cwd: PROJECT_ROOT,
    stdio: 'inherit', // Inherit parent's stdio to see logs
    env: { ...process.env }, // Inherit environment variables
  });

  emailServiceRunning = true;

  emailServiceProcess.on('exit', (code) => {
    console.log(`\n⚠️  Email service exited with code ${code}`);
    emailServiceRunning = false;

    // Auto-restart email service if it crashes
    console.log('🔄 Restarting email service in 5 seconds...\n');
    setTimeout(startEmailService, 5000);
  });

  emailServiceProcess.on('error', (err) => {
    console.error('❌ Email service error:', err);
    emailServiceRunning = false;
  });

  console.log('✅ Email service started (background process)\n');
}

/**
 * Graceful Shutdown
 */
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  if (emailServiceProcess) {
    console.log('🛑 Stopping email service...');
    emailServiceProcess.kill();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down server...');
  if (emailServiceProcess) {
    console.log('🛑 Stopping email service...');
    emailServiceProcess.kill();
  }
  process.exit(0);
});

/**
 * Start Server and Email Service
 */
app.listen(PORT, () => {
  console.log(`🌐 Website server running on http://localhost:${PORT}`);
  console.log(`📂 Serving files from: ${DIST_DIR}\n`);

  // Start email service
  startEmailService();
});
