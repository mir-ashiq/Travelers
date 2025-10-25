import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Get all gallery images
 * GET /api/gallery
 * Permission: gallery_view
 */
router.get('/', requirePermission('gallery_view'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

/**
 * Get single gallery image
 * GET /api/gallery/:id
 * Permission: gallery_view
 */
router.get('/:id', requirePermission('gallery_view'), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Gallery image not found' });
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching gallery image:', error);
    res.status(500).json({ error: 'Failed to fetch gallery image' });
  }
});

/**
 * Upload gallery image
 * POST /api/gallery
 * Permission: gallery_create
 */
router.post('/', requirePermission('gallery_create'), async (req, res) => {
  try {
    const { title, image_url, description, destination } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: 'Title and image URL are required' });
    }

    const { data, error } = await supabase
      .from('gallery')
      .insert([{ title, image_url, description, destination }])
      .select()
      .single();

    if (error) throw error;
    console.log(`✅ Gallery image uploaded: ${title}`);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ Error uploading gallery image:', error);
    res.status(500).json({ error: 'Failed to upload gallery image' });
  }
});

/**
 * Update gallery image
 * PUT /api/gallery/:id
 * Permission: gallery_edit
 */
router.put('/:id', requirePermission('gallery_edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('gallery')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Gallery image not found' });
    console.log(`✅ Gallery image ${id} updated`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error updating gallery image:', error);
    res.status(500).json({ error: 'Failed to update gallery image' });
  }
});

/**
 * Delete gallery image
 * DELETE /api/gallery/:id
 * Permission: gallery_delete
 */
router.delete('/:id', requirePermission('gallery_delete'), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log(`✅ Gallery image ${id} deleted`);
    res.json({ success: true, message: 'Gallery image deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting gallery image:', error);
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
});

export default router;
