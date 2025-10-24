#!/usr/bin/env node

/**
 * Email Service Starter
 * Automatically starts the email sender and keeps it running
 * This script:
 * 1. Checks if dependencies are installed
 * 2. Verifies .env file exists
 * 3. Starts email-sender.js
 * 4. Restarts if it crashes
 * 5. Runs 24/7 in the background
 * 
 * Usage: node start-email-service.js
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PROJECT_ROOT = __dirname;
const ENV_FILE = path.join(PROJECT_ROOT, '.env');
const EMAIL_SENDER_FILE = path.join(PROJECT_ROOT, 'email-sender.js');
const NODE_MODULES = path.join(PROJECT_ROOT, 'node_modules');

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║        🚀 JKLG Email Service Starter                   ║');
console.log('║       Auto-sending emails from queue                   ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

/**
 * Check if .env file exists
 */
function checkEnvFile() {
  if (!fs.existsSync(ENV_FILE)) {
    console.error('❌ ERROR: .env file not found!');
    console.error('\nPlease create .env file with these variables:');
    console.log(`
VITE_SUPABASE_URL=https://ynqceffvnagwrbchnyls.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[paste_your_service_role_key]
SMTP_HOST=mail.abctravels.site
SMTP_PORT=587
SMTP_USER=[your_email@abctravels.site]
SMTP_PASSWORD=[your_password]
SMTP_FROM=noreply@abctravels.site
    `);
    process.exit(1);
  }
  console.log('✅ .env file found');
}

/**
 * Check if dependencies are installed
 */
function checkDependencies() {
  const requiredModules = ['nodemailer', '@supabase/supabase-js'];
  const missing = [];

  for (const module of requiredModules) {
    const modulePath = path.join(NODE_MODULES, module);
    if (!fs.existsSync(modulePath)) {
      missing.push(module);
    }
  }

  if (missing.length > 0) {
    console.error('\n❌ Missing dependencies:', missing.join(', '));
    console.log('\n📦 Installing dependencies... This may take a minute.');
    console.log('   Run: npm install nodemailer @supabase/supabase-js\n');
    process.exit(1);
  }
  console.log('✅ Dependencies installed');
}

/**
 * Check if email-sender.js exists
 */
function checkEmailSender() {
  if (!fs.existsSync(EMAIL_SENDER_FILE)) {
    console.error('❌ ERROR: email-sender.js not found!');
    process.exit(1);
  }
  console.log('✅ email-sender.js found');
}

/**
 * Start the email sender service with auto-restart
 */
function startEmailService() {
  console.log('\n📧 Starting email sender service...\n');

  let restartCount = 0;
  let lastRestartTime = Date.now();

  function spawn_service() {
    const child = spawn('node', [EMAIL_SENDER_FILE], {
      stdio: 'inherit',
      cwd: PROJECT_ROOT,
    });

    child.on('exit', (code) => {
      const now = Date.now();
      const timeSinceLastRestart = (now - lastRestartTime) / 1000;

      // If crashed within 5 seconds, increment restart count
      if (timeSinceLastRestart < 5) {
        restartCount++;
        if (restartCount > 5) {
          console.error('\n❌ Service crashed multiple times. Check your configuration.');
          process.exit(1);
        }
      } else {
        restartCount = 0;
      }

      lastRestartTime = now;

      console.log(`\n⚠️  Service exited with code ${code}`);
      console.log(`🔄 Restarting in 5 seconds... (Restart #${restartCount + 1})\n`);

      setTimeout(spawn_service, 5000);
    });

    child.on('error', (error) => {
      console.error('❌ Failed to start service:', error);
      setTimeout(spawn_service, 5000);
    });
  }

  spawn_service();

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down email service...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\n🛑 Shutting down email service...');
    process.exit(0);
  });
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🔍 Checking configuration...\n');
    checkEnvFile();
    checkDependencies();
    checkEmailSender();
    startEmailService();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
