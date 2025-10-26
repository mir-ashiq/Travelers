/**
 * Customer Routes
 * 
 * Handles customer account management, registration, login, and profile operations
 * Customers are regular website users who book packages and view destinations
 * 
 * Endpoints:
 * - POST   /api/customers/register              - Create new customer account
 * - POST   /api/customers/login                 - Customer login
 * - POST   /api/customers/verify-email          - Verify customer email
 * - POST   /api/customers/resend-verification   - Resend verification email
 * - POST   /api/customers/forgot-password       - Request password reset
 * - POST   /api/customers/reset-password        - Reset password with token
 * - GET    /api/customers/me                    - Get current customer profile
 * - PUT    /api/customers/:id                   - Update customer profile
 * - GET    /api/customers/:id                   - Get customer by ID (public info)
 * - DELETE /api/customers/:id                   - Delete customer account (requires password)
 * - GET    /api/customers/:id/bookings          - Get customer's booking history
 * - GET    /api/customers/:id/addresses         - Get customer's saved addresses
 * - POST   /api/customers/:id/addresses         - Add new address
 * - DELETE /api/customers/:id/addresses/:addrId - Remove address
 * - GET    /api/customers/:id/preferences       - Get customer preferences
 * - PUT    /api/customers/:id/preferences       - Update customer preferences
 * - POST   /api/customers/change-password       - Change password
 * - POST   /api/customers/logout                - Customer logout (client-side token removal)
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import { sendEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let supabaseAdmin = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('⚠️  Supabase admin client not initialized - some operations may fail');
}

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware: Verify customer JWT token
 */
const verifyCustomerToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'customer') {
      return res.status(403).json({ error: 'Customer authentication required' });
    }

    req.customerId = decoded.customerId;
    req.email = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Utility: Hash password using bcryptjs
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Utility: Generate random verification token (32 chars)
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Utility: Generate random reset token (32 chars)
 */
const generateResetToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * POST /api/customers/register
 * Create new customer account
 * 
 * Body:
 * {
 *   email: string (required, unique)
 *   password: string (required, min 8 chars)
 *   name: string (required)
 *   phone?: string
 * }
 * 
 * Returns: { customerId, token, message }
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (existingCustomer) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create customer
    const { data: customer, error: createError } = await supabase
      .from('customers')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        phone: phone || null,
        status: 'pending', // Require email verification
        verified_at: null,
      })
      .select()
      .single();

    if (createError) {
      console.error('Customer creation error:', createError);
      return res.status(500).json({ error: 'Failed to create account' });
    }

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const tokenHash = await hashPassword(verificationToken);

    // Store verification token
    const { error: tokenError } = await supabase
      .from('email_verification_tokens')
      .insert({
        customer_id: customer.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

    if (tokenError) {
      console.error('Token creation error:', tokenError);
      return res.status(500).json({ error: 'Failed to create verification token' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { customerId: customer.id, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Send verification email
    try {
      await sendEmail({
        to: customer.email,
        subject: 'Verify Your Email - JKLG Travel',
        template: 'email-verification',
        data: {
          name: customer.name,
          verificationLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}&customerId=${customer.id}`,
          expiresIn: '24 hours',
        },
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      customerId: customer.id,
      token,
      message: 'Account created successfully. Please verify your email.',
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/customers/login
 * Customer login
 * 
 * Body:
 * {
 *   email: string (required)
 *   password: string (required)
 * }
 * 
 * Returns: { customerId, token, customer: {...} }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Get customer
    const { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError || !customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if verified
    if (!customer.verified_at) {
      return res.status(403).json({
        error: 'Email not verified',
        customerId: customer.id,
        message: 'Please verify your email before logging in',
      });
    }

    // Check if account is active
    if (customer.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, customer.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { customerId: customer.id, email: customer.email, role: 'customer' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Create session record
    await supabase.from('customer_sessions').insert({
      customer_id: customer.id,
      token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent'),
    });

    // Return safe customer data
    const { password_hash, ...safeCustomer } = customer;

    res.json({
      customerId: customer.id,
      token,
      customer: safeCustomer,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/customers/verify-email
 * Verify customer email with token
 * 
 * Body:
 * {
 *   customerId: string
 *   token: string
 * }
 * 
 * Returns: { message, customer: {...} }
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { customerId, token } = req.body;

    if (!customerId || !token) {
      return res.status(400).json({ error: 'Customer ID and token required' });
    }

    // Get verification token record
    const { data: tokenRecord } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('customer_id', customerId)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!tokenRecord) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    // Verify token
    const tokenMatch = await bcrypt.compare(token, tokenRecord.token_hash);
    if (!tokenMatch) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // Update customer as verified
    const { data: customer, error: updateError } = await supabase
      .from('customers')
      .update({
        verified_at: new Date().toISOString(),
        status: 'active',
      })
      .eq('id', customerId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to verify email' });
    }

    // Delete used token
    await supabase
      .from('email_verification_tokens')
      .delete()
      .eq('id', tokenRecord.id);

    const { password_hash, ...safeCustomer } = customer;

    res.json({
      message: 'Email verified successfully',
      customer: safeCustomer,
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

/**
 * POST /api/customers/resend-verification
 * Resend verification email
 * 
 * Body:
 * {
 *   email: string
 * }
 * 
 * Returns: { message }
 */
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Get customer
    const { data: customer } = await supabase
      .from('customers')
      .select('id, name, email, verified_at')
      .eq('email', email.toLowerCase())
      .single();

    if (!customer) {
      // Don't reveal if email exists
      return res.json({ message: 'If the email is registered, a verification link has been sent' });
    }

    if (customer.verified_at) {
      return res.json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const tokenHash = await hashPassword(verificationToken);

    // Store verification token
    await supabase
      .from('email_verification_tokens')
      .insert({
        customer_id: customer.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

    // Send verification email
    try {
      await sendEmail({
        to: customer.email,
        subject: 'Verify Your Email - JKLG Travel',
        template: 'email-verification',
        data: {
          name: customer.name,
          verificationLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}&customerId=${customer.id}`,
          expiresIn: '24 hours',
        },
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
});

/**
 * POST /api/customers/forgot-password
 * Request password reset
 * 
 * Body:
 * {
 *   email: string
 * }
 * 
 * Returns: { message }
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    // Get customer
    const { data: customer } = await supabase
      .from('customers')
      .select('id, name, email')
      .eq('email', email.toLowerCase())
      .single();

    if (!customer) {
      // Don't reveal if email exists
      return res.json({ message: 'If the email is registered, a password reset link has been sent' });
    }

    // Generate password reset token
    const resetToken = generateResetToken();
    const tokenHash = await hashPassword(resetToken);

    // Store reset token
    await supabase
      .from('password_reset_tokens')
      .insert({
        customer_id: customer.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });

    // Send reset email
    try {
      await sendEmail({
        to: customer.email,
        subject: 'Reset Your Password - JKLG Travel',
        template: 'password-reset',
        data: {
          name: customer.name,
          resetLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}&customerId=${customer.id}`,
          expiresIn: '1 hour',
        },
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.json({ message: 'Password reset link sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

/**
 * POST /api/customers/reset-password
 * Reset password with token
 * 
 * Body:
 * {
 *   customerId: string
 *   token: string
 *   newPassword: string
 * }
 * 
 * Returns: { message }
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { customerId, token, newPassword } = req.body;

    if (!customerId || !token || !newPassword) {
      return res.status(400).json({ error: 'Customer ID, token, and new password required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Get reset token record
    const { data: tokenRecord } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('customer_id', customerId)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!tokenRecord) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }

    // Verify token
    const tokenMatch = await bcrypt.compare(token, tokenRecord.token_hash);
    if (!tokenMatch) {
      return res.status(400).json({ error: 'Invalid password reset token' });
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update customer password
    const { error: updateError } = await supabase
      .from('customers')
      .update({ password_hash: passwordHash })
      .eq('id', customerId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update password' });
    }

    // Delete used token
    await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('id', tokenRecord.id);

    // Invalidate all active sessions
    await supabase
      .from('customer_sessions')
      .delete()
      .eq('customer_id', customerId);

    res.json({ message: 'Password reset successfully. Please log in again.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

/**
 * GET /api/customers/me
 * Get current customer profile (requires authentication)
 * 
 * Headers:
 * {
 *   Authorization: "Bearer {token}"
 * }
 * 
 * Returns: { customer: {...} }
 */
router.get('/me', verifyCustomerToken, async (req, res) => {
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('id, email, name, phone, avatar, address, verified_at, status, created_at, loyalty_points')
      .eq('id', req.customerId)
      .single();

    if (error || !customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

/**
 * PUT /api/customers/:id
 * Update customer profile (requires authentication)
 * 
 * Body:
 * {
 *   name?: string
 *   phone?: string
 *   avatar?: string (URL or base64)
 *   address?: string
 * }
 * 
 * Returns: { customer: {...} }
 */
router.put('/:id', verifyCustomerToken, async (req, res) => {
  try {
    // Verify customer owns this profile
    if (req.customerId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, phone, avatar, address } = req.body;

    // Build update object
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (avatar) updates.avatar = avatar;
    if (address) updates.address = address;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data: customer, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', req.customerId)
      .select('id, email, name, phone, avatar, address, verified_at, status, loyalty_points')
      .single();

    if (error) {
      console.error('Update customer error:', error);
      return res.status(500).json({ error: 'Failed to update customer' });
    }

    res.json({ customer });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

/**
 * GET /api/customers/:id
 * Get public customer info
 * 
 * Returns: { customer: { name, avatar, verified_at } }
 */
router.get('/:id', async (req, res) => {
  try {
    const { data: customer, error } = await supabase
      .from('customers')
      .select('id, name, avatar, verified_at')
      .eq('id', req.params.id)
      .single();

    if (error || !customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error) {
    console.error('Get public customer error:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

/**
 * DELETE /api/customers/:id
 * Delete customer account (requires password confirmation)
 * 
 * Body:
 * {
 *   password: string (confirmation)
 * }
 * 
 * Returns: { message }
 */
router.delete('/:id', verifyCustomerToken, async (req, res) => {
  try {
    // Verify customer owns this profile
    if (req.customerId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password required for account deletion' });
    }

    // Get customer with password hash
    const { data: customer } = await supabase
      .from('customers')
      .select('password_hash')
      .eq('id', req.customerId)
      .single();

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, customer.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Delete customer (cascade will handle related records)
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', req.customerId);

    if (error) {
      console.error('Delete customer error:', error);
      return res.status(500).json({ error: 'Failed to delete account' });
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

/**
 * GET /api/customers/:id/bookings
 * Get customer's booking history
 * 
 * Returns: { bookings: [...] }
 */
router.get('/:id/bookings', verifyCustomerToken, async (req, res) => {
  try {
    // Verify customer owns this profile
    if (req.customerId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        package_id,
        travel_date,
        return_date,
        num_adults,
        num_children,
        total_price,
        payment_status,
        status,
        created_at,
        packages(id, name, price, destination_id)
      `)
      .eq('customer_id', req.customerId)
      .order('travel_date', { ascending: false });

    if (error) {
      console.error('Get bookings error:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/**
 * GET /api/customers/:id/addresses
 * Get customer's saved addresses
 * 
 * Returns: { addresses: [...] }
 */
router.get('/:id/addresses', verifyCustomerToken, async (req, res) => {
  try {
    // Verify customer owns this profile
    if (req.customerId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { data: addresses, error } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', req.customerId);

    if (error) {
      console.error('Get addresses error:', error);
      return res.status(500).json({ error: 'Failed to fetch addresses' });
    }

    res.json({ addresses });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

/**
 * POST /api/customers/:id/addresses
 * Add new address
 * 
 * Body:
 * {
 *   label: string (e.g., "Home", "Work")
 *   street: string
 *   city: string
 *   state: string
 *   postal_code: string
 *   country: string
 * }
 * 
 * Returns: { address: {...} }
 */
router.post('/:id/addresses', verifyCustomerToken, async (req, res) => {
  try {
    // Verify customer owns this profile
    if (req.customerId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { label, street, city, state, postal_code, country } = req.body;

    if (!label || !street || !city || !country) {
      return res.status(400).json({ error: 'Label, street, city, and country are required' });
    }

    const { data: address, error } = await supabase
      .from('customer_addresses')
      .insert({
        customer_id: req.customerId,
        label,
        street,
        city,
        state,
        postal_code,
        country,
      })
      .select()
      .single();

    if (error) {
      console.error('Create address error:', error);
      return res.status(500).json({ error: 'Failed to create address' });
    }

    res.status(201).json({ address });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Failed to create address' });
  }
});

/**
 * DELETE /api/customers/:id/addresses/:addrId
 * Remove address
 * 
 * Returns: { message }
 */
router.delete('/:id/addresses/:addrId', verifyCustomerToken, async (req, res) => {
  try {
    // Verify customer owns this profile
    if (req.customerId !== req.params.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Verify address belongs to customer
    const { data: address } = await supabase
      .from('customer_addresses')
      .select('id')
      .eq('id', req.params.addrId)
      .eq('customer_id', req.customerId)
      .single();

    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const { error } = await supabase
      .from('customer_addresses')
      .delete()
      .eq('id', req.params.addrId);

    if (error) {
      console.error('Delete address error:', error);
      return res.status(500).json({ error: 'Failed to delete address' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

/**
 * POST /api/customers/change-password
 * Change password (requires old password)
 * 
 * Body:
 * {
 *   oldPassword: string
 *   newPassword: string
 * }
 * 
 * Returns: { message }
 */
router.post('/change-password', verifyCustomerToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    // Get customer with password hash
    const { data: customer } = await supabase
      .from('customers')
      .select('password_hash')
      .eq('id', req.customerId)
      .single();

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Verify old password
    const passwordMatch = await bcrypt.compare(oldPassword, customer.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    const { error } = await supabase
      .from('customers')
      .update({ password_hash: passwordHash })
      .eq('id', req.customerId);

    if (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ error: 'Failed to change password' });
    }

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;
