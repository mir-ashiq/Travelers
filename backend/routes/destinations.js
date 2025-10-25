import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Get all destinations
 * GET /api/destinations
 * Permission: destinations_view
 */
router.get('/', requirePermission('destinations_view'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

/**
 * Get single destination
 * GET /api/destinations/:id
 * Permission: destinations_view
 */
router.get('/:id', requirePermission('destinations_view'), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Destination not found' });
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching destination:', error);
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

/**
 * Create destination
 * POST /api/destinations
 * Permission: destinations_create
 */
router.post('/', requirePermission('destinations_create'), async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Destination name is required' });
    }

    const { data, error } = await supabase
      .from('destinations')
      .insert([{ name, description, image_url }])
      .select()
      .single();

    if (error) throw error;
    console.log(`✅ Destination created: ${name}`);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ Error creating destination:', error);
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

/**
 * Update destination
 * PUT /api/destinations/:id
 * Permission: destinations_edit
 */
router.put('/:id', requirePermission('destinations_edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('destinations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Destination not found' });
    console.log(`✅ Destination ${id} updated`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error updating destination:', error);
    res.status(500).json({ error: 'Failed to update destination' });
  }
});

/**
 * Delete destination
 * DELETE /api/destinations/:id
 * Permission: destinations_delete
 */
router.delete('/:id', requirePermission('destinations_delete'), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log(`✅ Destination ${id} deleted`);
    res.json({ success: true, message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting destination:', error);
    res.status(500).json({ error: 'Failed to delete destination' });
  }
});

export default router;
