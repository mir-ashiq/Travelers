import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Get all testimonials
 * GET /api/testimonials
 * Permission: testimonials_view
 */
router.get('/', requirePermission('testimonials_view'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

/**
 * Get single testimonial
 * GET /api/testimonials/:id
 * Permission: testimonials_view
 */
router.get('/:id', requirePermission('testimonials_view'), async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching testimonial:', error);
    res.status(500).json({ error: 'Failed to fetch testimonial' });
  }
});

/**
 * Create testimonial
 * POST /api/testimonials
 * Permission: testimonials_create
 */
router.post('/', requirePermission('testimonials_create'), async (req, res) => {
  try {
    const { customer_name, rating, content, image_url } = req.body;

    if (!customer_name || !rating || !content) {
      return res.status(400).json({ error: 'Customer name, rating, and content are required' });
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ customer_name, rating, content, image_url, is_approved: false }])
      .select()
      .single();

    if (error) throw error;
    console.log(`✅ Testimonial created from ${customer_name}`);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('❌ Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

/**
 * Update testimonial
 * PUT /api/testimonials/:id
 * Permission: testimonials_edit
 */
router.put('/:id', requirePermission('testimonials_edit'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Testimonial not found' });
    console.log(`✅ Testimonial ${id} updated`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error updating testimonial:', error);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

/**
 * Approve testimonial
 * PATCH /api/testimonials/:id/approve
 * Permission: testimonials_approve
 */
router.patch('/:id/approve', requirePermission('testimonials_approve'), async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('testimonials')
      .update({ is_approved: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Testimonial not found' });
    console.log(`✅ Testimonial ${id} approved`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Error approving testimonial:', error);
    res.status(500).json({ error: 'Failed to approve testimonial' });
  }
});

/**
 * Delete testimonial
 * DELETE /api/testimonials/:id
 * Permission: testimonials_delete
 */
router.delete('/:id', requirePermission('testimonials_delete'), async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log(`✅ Testimonial ${id} deleted`);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
