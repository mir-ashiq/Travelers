import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { requirePermission, requireAuth } from '../middleware/auth.js';

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
 * Create booking (Public - for guests and customers)
 * POST /api/bookings
 * Body: {
 *   package_id: number,
 *   customer_email: string,
 *   customer_name: string,
 *   customer_phone: string,
 *   travel_date: string (ISO date),
 *   number_of_guests: number,
 *   special_requests?: string,
 *   customer_id?: string (optional - if registered customer)
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { 
      package_id, 
      customer_email, 
      customer_name, 
      customer_phone, 
      travel_date, 
      number_of_guests,
      special_requests,
      customer_id
    } = req.body;

    // Validation
    if (!package_id || !customer_email || !customer_name || !customer_phone || !travel_date || !number_of_guests) {
      return res.status(400).json({
        error: 'Missing required fields: package_id, customer_email, customer_name, customer_phone, travel_date, number_of_guests'
      });
    }

    // Get package details to calculate price
    const { data: pkg, error: pkgError } = await supabase
      .from('packages')
      .select('id, title, price_per_person, duration')
      .eq('id', package_id)
      .single();

    if (pkgError || !pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Calculate total price
    const totalPrice = pkg.price_per_person * number_of_guests;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        package_id,
        customer_id: customer_id || null,
        customer_name,
        customer_email,
        customer_phone,
        travel_date,
        number_of_guests,
        special_requests: special_requests || null,
        amount: totalPrice,
        status: 'Pending',
        payment_status: 'Pending',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      return res.status(400).json({ error: 'Failed to create booking' });
    }

    console.log(`✅ Booking created: ${booking.id}`);
    res.status(201).json({ 
      success: true, 
      booking,
      message: 'Booking created successfully. Proceed to payment.'
    });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

/**
 * Get single booking (Public - no auth required)
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

    res.json({ booking: data });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

/**
 * POST /api/bookings/assign
 * Body: { id: number, assigned_to: string }
 * Permission: bookings_reassign
 */
router.post('/assign', requirePermission('bookings_reassign'), async (req, res) => {
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
 * Update payment for booking
 * POST /api/bookings/update-payment
 * Body: { id: number, payment_status: string, amount?: number }
 * payment_status: 'Paid' | 'Pending' | 'Refunded'
 * Permission: bookings_update_payment
 */
router.post('/update-payment', requirePermission('bookings_update_payment'), async (req, res) => {
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
 * Bulk delete bookings
 * POST /api/bookings/bulk-delete
 * Body: { ids: number[] }
 * Permission: bookings_delete (Admin only)
 * NOTE: Must be defined BEFORE GET /:id route
 */
router.post('/bulk-delete', requirePermission('bookings_delete'), async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No booking IDs provided' });
    }

    // Bulk delete bookings
    const { error } = await supabase
      .from('bookings')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`✅ Deleted ${ids.length} booking(s)`);
    res.json({ 
      success: true, 
      message: `${ids.length} booking(s) deleted successfully`,
      deletedCount: ids.length 
    });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to delete bookings' });
  }
});

/**
 * Get all bookings (Admin only)
 * GET /api/bookings
 * Permission: bookings_view
 */
router.get('/', requirePermission('bookings_view'), async (req, res) => {
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
 * Update booking (Admin only)
router.patch('/:id', requirePermission('bookings_edit'), async (req, res) => {
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

/**
 * Delete single booking
 * DELETE /api/bookings/:id
 * Permission: bookings_delete (Admin only)
 */
router.delete('/:id', requirePermission('bookings_delete'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    // Delete booking
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log(`✅ Booking ${id} deleted`);
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;
