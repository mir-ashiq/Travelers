import express from 'express';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { verifyAdmin, requirePermission, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// JWT secret for token generation
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Handle CORS preflight for all routes - MUST come before routes
 */
router.options('*', (req, res) => {
  res.set('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Max-Age', '3600');
  res.sendStatus(200);
});

/**
 * GET /api/users
 * List all admin users
 * Headers: Authorization: Bearer <token>
 * Query: ?role=Admin&status=Active&search=email
 * Permission: users_view
 */
router.get('/', requirePermission('users_view'), async (req, res) => {
  try {
    const { role, status, search } = req.query;

    let query = supabase.from('admin_users').select('*');

    if (role) {
      query = query.eq('role', role);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;

    // Don't expose password hashes
    const users = data.map(({ password_hash, ...rest }) => rest);

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * GET /api/users/:id
 * Get single user by ID
 * Headers: Authorization: Bearer <token>
 * Permission: users_view
 */
router.get('/:id', requirePermission('users_view'), async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't expose password hash
    const { password_hash, ...user } = data;

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * POST /api/users
 * Create new admin user
 * Headers: Authorization: Bearer <token>
 * Body: { name, email, phone, role, password, avatar?, status? }
 */
router.post('/', requirePermission(['users_create', 'users_change_role'], true), async (req, res) => {
  try {
    const { name, email, phone, role, password, avatar, status } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !role || !password) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, phone, role, password',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        name,
        email,
        phone,
        role,
        avatar: avatar || null,
        status: status || 'Active',
        password_hash: passwordHash,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    // Don't expose password hash
    const { password_hash, ...user } = data;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * PUT /api/users/:id
 * Update admin user (Admin only)
 * Permission: users_edit, users_change_role
 */
router.put('/:id', requirePermission(['users_edit', 'users_change_role'], true), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, avatar, status } = req.body;

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // If email is being changed, check if it already exists
    if (email) {
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email)
        .neq('id', parseInt(id))
        .single();

      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }
    }

    // Update user
    const { data, error } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't expose password hash
    const { password_hash, ...user } = data;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * DELETE /api/users/:id
 * Delete admin user (Admin only)
 * Permission: users_delete
 */
router.delete('/:id', requirePermission('users_delete'), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Check if user exists
    const { data: userExists } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', parseInt(id))
      .single();

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

/**
 * PATCH /api/users/:id/status
 * Toggle user status (Active/Inactive)
 * Headers: Authorization: Bearer <token>
 * Body: { status: 'Active' | 'Inactive' }
 * Permission: users_edit
 */
router.patch('/:id/status', requirePermission('users_edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        error: "Status must be 'Active' or 'Inactive'",
      });
    }

    // Prevent deactivating yourself
    if (req.user.id === parseInt(id) && status === 'Inactive') {
      return res.status(400).json({
        error: 'Cannot deactivate your own account',
      });
    }

    const { data, error } = await supabase
      .from('admin_users')
      .update({ status, is_active: status === 'Active' })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't expose password hash
    const { password_hash, ...user } = data;

    res.json({
      success: true,
      message: 'User status updated',
      data: user,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

export default router;
