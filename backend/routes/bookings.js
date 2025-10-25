import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Update booking assignment
 * POST /api/bookings/assign
 * Body: { id: number, assigned_to: string }
 */
router.post('/assign', async (req, res) => {
  try {
    const { id, assigned_to } = req.body;

    if (!id || assigned_to === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: id and assigned_to' 
      });
    }

    // Use service role key to bypass RLS for admin operations
    const { data, error } = await supabase
      .from('bookings')
      .update({ assigned_to })
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`✅ Booking ${id} assigned to: ${assigned_to}`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to assign booking' });
  }
});

/**
 * Get all bookings
 * GET /api/bookings
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/**
 * Get single booking
 * GET /api/bookings/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

/**
 * Update payment for booking
 * POST /api/bookings/update-payment
 * Body: { id: number, payment_status: string, amount?: number }
 * payment_status: 'Paid' | 'Pending' | 'Refunded'
 */
router.post('/update-payment', async (req, res) => {
  try {
    const { id, payment_status, amount } = req.body;

    // Validation
    if (!id || !payment_status) {
      return res.status(400).json({ 
        error: 'Missing required fields: id and payment_status' 
      });
    }

    const validStatuses = ['Paid', 'Pending', 'Refunded'];
    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({ 
        error: `Invalid payment_status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    // Build update object
    const updates = { payment_status };
    if (amount !== undefined && amount > 0) {
      updates.amount = amount;
    }

    // Update booking
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log(`✅ Booking ${id} payment updated to: ${payment_status} ${amount ? `(Amount: ₹${amount})` : ''}`);
    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

/**
 * Update booking
 * PATCH /api/bookings/:id
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`✅ Booking ${id} updated`);
    res.json({ success: true, data });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

export default router;
