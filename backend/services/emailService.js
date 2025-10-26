/**
 * Email Service
 * Handles sending emails using Nodemailer
 */

import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Supabase for queuing emails
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

let transporter = null;

/**
 * Initialize email transporter
 * Supports: SMTP, Gmail, Sendgrid, etc.
 */
const initTransporter = () => {
  if (transporter) return transporter;

  // SMTP Configuration from environment
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM_EMAIL,
    SMTP_FROM_NAME,
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT) {
    console.warn('⚠️  Email service not configured. Set SMTP_HOST and SMTP_PORT in .env');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT),
    secure: SMTP_PORT === '465', // true for 465, false for other ports
    auth: SMTP_USER && SMTP_PASSWORD ? {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    } : undefined,
  });

  console.log('✅ Email service initialized');
  return transporter;
};

/**
 * Email templates
 */
const templates = {
  'email-verification': (data) => ({
    subject: 'Verify Your Email - JKLG Travel',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
          .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { font-size: 12px; color: #999; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to JKLG Travel! 🌍</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            <p>Thank you for registering with JKLG Travel. Please verify your email address to complete your registration.</p>
            <a href="${data.verificationLink}" class="button">Verify Email</a>
            <p>Or copy this link: <br/>${data.verificationLink}</p>
            <p><strong>Note:</strong> This link expires in ${data.expiresIn}</p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; 2024 JKLG Travel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  'password-reset': (data) => ({
    subject: 'Reset Your Password - JKLG Travel',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 5px; }
          .content { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: #f5576c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { font-size: 12px; color: #999; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
          .warning { color: #d32f2f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password.</p>
            <a href="${data.resetLink}" class="button">Reset Password</a>
            <p>Or copy this link: <br/>${data.resetLink}</p>
            <p><strong class="warning">⚠️ Security Notice:</strong></p>
            <ul>
              <li>This link expires in ${data.expiresIn}</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Never share this link with anyone</li>
            </ul>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; 2024 JKLG Travel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  'booking-confirmation': (data) => ({
    subject: `Booking Confirmation - ${data.packageName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
          .details { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 5px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .footer { font-size: 12px; color: #999; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed! ✈️</h1>
          </div>
          <div class="details">
            <h2>${data.packageName}</h2>
            <div class="detail-row">
              <strong>Booking ID:</strong> <span>${data.bookingId}</span>
            </div>
            <div class="detail-row">
              <strong>Travel Date:</strong> <span>${data.travelDate}</span>
            </div>
            <div class="detail-row">
              <strong>Adults:</strong> <span>${data.adults}</span>
            </div>
            <div class="detail-row">
              <strong>Children:</strong> <span>${data.children}</span>
            </div>
            <div class="detail-row">
              <strong>Total Price:</strong> <span>${data.currency} ${data.totalPrice}</span>
            </div>
          </div>
          <p>Thank you for choosing JKLG Travel. We're excited to help you create unforgettable memories!</p>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; 2024 JKLG Travel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  'payment-receipt': (data) => ({
    subject: `Payment Receipt - ${data.bookingId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 20px; border-radius: 5px; }
          .details { padding: 20px; background: #f9f9f9; margin: 20px 0; border-radius: 5px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .footer { font-size: 12px; color: #999; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Receipt 💳</h1>
          </div>
          <div class="details">
            <div class="detail-row">
              <strong>Booking ID:</strong> <span>${data.bookingId}</span>
            </div>
            <div class="detail-row">
              <strong>Transaction ID:</strong> <span>${data.transactionId}</span>
            </div>
            <div class="detail-row">
              <strong>Amount:</strong> <span>${data.currency} ${data.amount}</span>
            </div>
            <div class="detail-row">
              <strong>Payment Method:</strong> <span>${data.paymentMethod}</span>
            </div>
            <div class="detail-row">
              <strong>Status:</strong> <span style="color: green; font-weight: bold;">${data.status}</span>
            </div>
            <div class="detail-row">
              <strong>Date:</strong> <span>${data.date}</span>
            </div>
          </div>
          <p>Your payment has been received successfully.</p>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; 2024 JKLG Travel. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

/**
 * Send email (queues to email_history for background processing)
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject (optional if using template)
 * @param {string} options.template - Template name (optional)
 * @param {string} options.html - HTML content (optional if using template)
 * @param {Object} options.data - Template data
 * @returns {Promise<Object>} Queue result
 */
export const sendEmail = async (options) => {
  try {
    let subject = options.subject;
    let html = options.html;

    // If template is specified, use template
    if (options.template && templates[options.template]) {
      const template = templates[options.template](options.data);
      subject = subject || template.subject;
      html = template.html;
    }

    if (!subject || !html) {
      throw new Error('Subject and HTML content are required');
    }

    // Queue email to database instead of sending directly
    if (supabase) {
      const { error: insertError } = await supabase
        .from('email_history')
        .insert({
          recipient_email: options.to,
          subject,
          body: html,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error(`❌ Error queuing email: ${insertError.message}`);
        return { success: false, error: insertError.message };
      }

      console.log(`📧 Email queued to ${options.to}: ${subject}`);
      return { success: true, queued: true };
    } else {
      // Fallback: Send directly if Supabase not available
      const transporter = initTransporter();
      
      if (!transporter) {
        console.warn('⚠️  Email service not available, skipping email send');
        return { success: false, error: 'Email service not configured' };
      }

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@jklgtravel.com',
        to: options.to,
        subject,
        html,
      };

      const result = await transporter.sendMail(mailOptions);
      
      console.log(`📧 Email sent to ${options.to}: ${subject}`);
      return { success: true, messageId: result.messageId };
    }
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send batch emails
 * @param {Array<Object>} recipients - Array of email options
 * @returns {Promise<Array>} Array of send results
 */
export const sendBatchEmails = async (recipients) => {
  return Promise.all(recipients.map(sendEmail));
};

/**
 * Test email configuration
 * @returns {Promise<boolean>} Connection success
 */
export const testEmailConnection = async () => {
  try {
    const transporter = initTransporter();
    if (!transporter) return false;
    
    await transporter.verify();
    console.log('✅ Email service verified and ready to send');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error);
    return false;
  }
};

export default {
  sendEmail,
  sendBatchEmails,
  testEmailConnection,
};
