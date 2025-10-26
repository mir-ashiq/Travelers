/**
 * Email Sender Service
 * Reads pending emails from email_history table and sends them via SMTP
 * Run with: node email-sender.js
 */

import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Load .env file if it exists
if (fs.existsSync('.env')) {
  dotenv.config();
} else {
  console.log('ℹ️  .env file not found. Using environment variables instead.\n');
}

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ynqceffvnagwrbchnyls.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  console.error('   Set it in .env or as a system environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// SMTP Configuration from environment
const SMTP_HOST = process.env.SMTP_HOST || 'mail.abctravels.site';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@abctravels.site';

// Validate SMTP configuration
if (!SMTP_USER || !SMTP_PASSWORD) {
  console.error('❌ SMTP credentials not configured');
  console.error('   Set SMTP_USER and SMTP_PASSWORD in .env or environment variables');
  process.exit(1);
}

console.log('📧 Email Sender Service Starting...');
console.log(`SMTP Server: ${SMTP_HOST}:${SMTP_PORT}`);
console.log(`From: ${SMTP_FROM}`);

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Send a single email
 */
async function sendEmail(emailRecord) {
  try {
    console.log(`\n📮 Sending email to ${emailRecord.recipient_email}...`);

    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: emailRecord.recipient_email,
      subject: emailRecord.subject,
      html: emailRecord.body,
      // Plain text fallback (strip HTML tags)
      text: emailRecord.body.replace(/<[^>]*>/g, ''),
    });

    console.log(`✅ Email sent: ${info.messageId}`);

    // Update email status to 'sent'
    const { error: updateError } = await supabase
      .from('email_history')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', emailRecord.id);

    if (updateError) {
      console.error(`❌ Error updating email status: ${updateError.message}`);
      // Try to reset status back to pending if update fails
      await supabase
        .from('email_history')
        .update({ status: 'pending' })
        .eq('id', emailRecord.id);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);

    // Update email status to 'failed' with error message
    try {
      await supabase
        .from('email_history')
        .update({
          status: 'failed',
          error_message: error.message,
        })
        .eq('id', emailRecord.id);
    } catch (updateErr) {
      console.error(`❌ Could not update error status: ${updateErr.message}`);
    }

    return false;
  }
}

/**
 * Cleanup abandoned processing emails (from previous crashed runs)
 * If an email is stuck in 'processing' status for more than 5 minutes, reset it to 'pending'
 */
async function cleanupAbandonedEmails() {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: abandonedEmails, error: fetchError } = await supabase
      .from('email_history')
      .select('*')
      .eq('status', 'processing')
      .lt('updated_at', fiveMinutesAgo);

    if (fetchError) {
      console.error(`❌ Error fetching abandoned emails: ${fetchError.message}`);
      return;
    }

    if (!abandonedEmails || abandonedEmails.length === 0) {
      return; // No abandoned emails to clean up
    }

    console.log(`\n🧹 Cleaning up ${abandonedEmails.length} abandoned email(s) stuck in processing...`);

    for (const email of abandonedEmails) {
      const { error: updateError } = await supabase
        .from('email_history')
        .update({ status: 'pending' })
        .eq('id', email.id);

      if (updateError) {
        console.error(`❌ Error resetting email ${email.id}: ${updateError.message}`);
      } else {
        console.log(`✅ Reset email ${email.id} back to pending`);
      }
    }
  } catch (error) {
    console.error(`❌ Error in cleanup: ${error.message}`);
  }
}

/**
 * Process all pending emails
 */
async function processPendingEmails() {
  try {
    console.log('\n🔍 Fetching pending emails...');

    // Get all pending emails with a lock mechanism
    // We use a transaction-like approach by immediately marking as 'processing'
    const { data: pendingEmails, error: fetchError } = await supabase
      .from('email_history')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10); // Process max 10 emails per run

    if (fetchError) {
      console.error(`❌ Error fetching emails: ${fetchError.message}`);
      return;
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      console.log('✅ No pending emails to send');
      return;
    }

    console.log(`📬 Found ${pendingEmails.length} pending email(s)`);

    let successCount = 0;
    let failureCount = 0;

    // Send each email
    for (const email of pendingEmails) {
      // Mark email as 'processing' to avoid duplicate sends
      const { error: lockError } = await supabase
        .from('email_history')
        .update({ status: 'processing' })
        .eq('id', email.id)
        .eq('status', 'pending'); // Only update if still pending

      if (lockError) {
        console.error(`❌ Error locking email ${email.id}: ${lockError.message}`);
        continue;
      }

      // Now send the email
      const success = await sendEmail(email);
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
      // Add a small delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`\n📊 Summary: ${successCount} sent, ${failureCount} failed`);
  } catch (error) {
    console.error(`❌ Unexpected error: ${error.message}`);
  }
}

/**
 * Verify SMTP connection
 */
async function verifyConnection() {
  try {
    console.log('🔐 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified');
    return true;
  } catch (error) {
    console.error(`❌ SMTP connection failed: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  // Verify connection first
  const isConnected = await verifyConnection();
  if (!isConnected) {
    console.error('❌ Cannot connect to SMTP server. Please check your credentials.');
    process.exit(1);
  }

  // Clean up any abandoned emails from previous crashes
  await cleanupAbandonedEmails();

  // Process emails once
  await processPendingEmails();

  // Optional: Process emails every 30 seconds
  console.log('\n⏰ Setting up to process emails every 30 seconds...');
  setInterval(async () => {
    console.log('\n🔄 Running scheduled email check...');
    await cleanupAbandonedEmails();
    await processPendingEmails();
  }, 30000); // 30 seconds
}

// Run the service
main().catch((error) => {
  console.error(`❌ Fatal error: ${error.message}`);
  process.exit(1);
});
