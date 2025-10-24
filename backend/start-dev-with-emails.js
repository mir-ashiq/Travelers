#!/usr/bin/env node

/**
 * Development Server with Email Service
 * Starts:
 * 1. Express backend server on port 3000
 * 2. Email sender service (background process)
 * 
 * Usage: node start-dev-with-emails.js
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Load .env file if it exists
if (fs.existsSync('.env')) {
  dotenv.config();
} else {
  console.log('ℹ️  .env file not found. Using environment variables instead.\n');
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = __dirname;

console.log(`
╔════════════════════════════════════════════════════════╗
║  📱 JKLG Travel Agency Development Server             ║
║                                                        ║
║  Backend API: http://localhost:3000 (Express)        ║
║  Email Service: Running automatically                ║
╚════════════════════════════════════════════════════════╝
`);

// Start Express backend server
console.log('🚀 Starting Express backend server...\n');
const serverProcess = spawn('node', ['server.js'], {
  cwd: PROJECT_ROOT,
  stdio: 'inherit',
  shell: true,
});

serverProcess.on('exit', (code) => {
  console.log(`\n⚠️  Backend server exited with code ${code}`);
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

  // Check if required SMTP environment variables are set
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD'];
  const missingVars = requiredVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    console.warn('⚠️  Missing SMTP environment variables: ' + missingVars.join(', '));
    console.warn('   Email service will not start.');
    console.warn('   Set variables in .env or system environment.\n');
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
  if (serverProcess) {
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
  if (serverProcess) {
    viteProcess.kill();
  }
  process.exit(0);
});
