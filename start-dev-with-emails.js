#!/usr/bin/env node

/**
 * Development Server with Email Service
 * Starts:
 * 1. Vite dev server (hot reload) on port 5173
 * 2. Email sender service (background process)
 * 
 * Usage: node start-dev-with-emails.js
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = __dirname;

console.log(`
╔════════════════════════════════════════════════════════╗
║  📱 JKLG Travel Agency Development Server             ║
║                                                        ║
║  Website: http://localhost:5173 (with hot reload)    ║
║  Email Service: Running automatically                ║
╚════════════════════════════════════════════════════════╝
`);

// Start Vite dev server
console.log('🚀 Starting Vite development server...\n');
const viteProcess = spawn('npm', ['run', 'dev'], {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
  shell: true,
});

viteProcess.on('exit', (code) => {
  console.log(`\n⚠️  Vite server exited with code ${code}`);
  if (emailServiceProcess) {
    emailServiceProcess.kill();
  }
  process.exit(code);
});

// Start Email Service
let emailServiceProcess = null;
let emailServiceRunning = false;

function startEmailService() {
  console.log('\n📧 Starting email service...\n');

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
    stdio: 'inherit',
    env: { ...process.env },
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

// Start email service after a short delay
setTimeout(startEmailService, 1000);

/**
 * Graceful Shutdown
 */
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down development server...');
  if (emailServiceProcess) {
    console.log('🛑 Stopping email service...');
    emailServiceProcess.kill();
  }
  if (viteProcess) {
    viteProcess.kill();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down development server...');
  if (emailServiceProcess) {
    console.log('🛑 Stopping email service...');
    emailServiceProcess.kill();
  }
  if (viteProcess) {
    viteProcess.kill();
  }
  process.exit(0);
});
