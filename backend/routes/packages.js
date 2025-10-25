import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Get all packages
 * GET /api/packages
 * Permission: packages_view
 */
router.get('/', requirePermission('packages_view'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching packages:', error);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
});

/**
 * Get single package
 * GET /api/packages/:id
 * Permission: packages_view
 */
router.get('/:id', requirePermission('packages_view'), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Package not found' });
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching package:', error);
    res.status(500).json({ error: 'Failed to fetch package' });
  }
});

/**
 * Create package
 * POST /api/packages
 * Permission: packages_create
 */
router.post('/', requirePermission('packages_create'), async (req, res) => {
  try {
    const { name, description, price, duration, destinations } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: 'Package name and price are required' });
    }

    const { data, error } = await supabase
      .from('packages')
      .insert([{ name, description, price, duration, destinations }])
      .select()
      .single();

    if (error) throw error;
    console.log(`✅ Package created: ${name}`);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ Error creating package:', error);
    res.status(500).json({ error: 'Failed to create package' });
  }
});

/**
 * Update package
 * PUT /api/packages/:id
 * Permission: packages_edit
 */
router.put('/:id', requirePermission('packages_edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('packages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Package not found' });
    console.log(`✅ Package ${id} updated`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error updating package:', error);
    res.status(500).json({ error: 'Failed to update package' });
  }
});

/**
 * Delete package
 * DELETE /api/packages/:id
 * Permission: packages_delete
 */
router.delete('/:id', requirePermission('packages_delete'), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log(`✅ Package ${id} deleted`);
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting package:', error);
    res.status(500).json({ error: 'Failed to delete package' });
  }
});

export default router;
