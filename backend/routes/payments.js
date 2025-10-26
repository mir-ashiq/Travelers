/**
 * Payment Routes - Stripe Integration
 * Handles all payment processing and transaction management
 * 
 * Endpoints:
 * POST /api/payments/create-payment-intent - Create Stripe payment intent
 * GET /api/payments/transactions - List transactions (admin)
 * GET /api/payments/transactions/:id - Get transaction details
 * POST /api/payments/process-webhook - Handle Stripe webhooks
 * POST /api/payments/refund - Process refund
 * GET /api/payments/booking/:bookingId - Get payment status for booking
 */

import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth, requirePermission } from '../middleware/auth.js';
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

// Initialize Stripe
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Helper: Check Supabase initialization
 */
const checkSupabaseInit = (req, res) => {
  if (!supabaseAdmin) {
    console.error('Supabase not initialized for payments');
    res.status(500).json({ error: 'Database connection not configured' });
    return false;
  }
  return true;
};

/**
 * POST /api/payments/create-payment-intent
 * Create a Stripe payment intent for a booking
 * 
 * Request body:
 * {
 *   bookingId: number,
 *   amount: number (in cents),
 *   email: string,
 *   name: string,
 *   customerId?: string (Stripe customer ID if exists)
 * }
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    if (!checkSupabaseInit(req, res)) return;

    const { bookingId, amount, email, name, customerId } = req.body;

    // Validate input
    if (!bookingId || !amount || !email || !name) {
      return res.status(400).json({
        error: 'Missing required fields: bookingId, amount, email, name'
      });
    }

    if (amount < 50) {
      return res.status(400).json({
        error: 'Amount must be at least $0.50'
      });
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Create or get Stripe customer
    let stripeCustomerId = customerId;
    if (!stripeCustomerId) {
      try {
        const customer = await stripeClient.customers.create({
          email,
          name,
          metadata: {
            bookingId,
            customerId: email // Use email as identifier
          }
        });
        stripeCustomerId = customer.id;
      } catch (error) {
        console.error('Error creating Stripe customer:', error);
        return res.status(500).json({ error: 'Failed to create payment customer' });
      }
    }

    // Create payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount, // in cents
      currency: process.env.PAYMENT_CURRENCY || 'usd',
      customer: stripeCustomerId,
      description: `Payment for booking #${bookingId}`,
      metadata: {
        bookingId: String(bookingId),
        email,
        name
      },
      statement_descriptor: 'JKLG Travel Agency'
    });

    // Store transaction record (pending)
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .insert([
        {
          booking_id: bookingId,
          amount,
          currency: process.env.PAYMENT_CURRENCY || 'USD',
          status: 'pending',
          gateway: 'stripe',
          transaction_id: paymentIntent.id,
          metadata: {
            customer_id: stripeCustomerId,
            payment_intent: paymentIntent.id
          }
        }
      ])
      .select()
      .single();

    if (txError) {
      console.error('Error creating transaction record:', txError);
      // Continue anyway - transaction will be created via webhook
    }

    res.json({
      clientSecret: paymentIntent.client_secret,
      stripeCustomerId,
      transactionId: transaction?.id,
      amount,
      email,
      name
    });

  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      details: error.message
    });
  }
});

/**
 * POST /api/payments/process-webhook
 * Handle Stripe webhook events
 */
router.post('/process-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!checkSupabaseInit(req, res)) return;

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return res.status(500).json({ error: 'Webhook not configured' });
    }

    let event;
    try {
      event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error.message);
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    console.log(`📧 Stripe Event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Handle payment_intent.succeeded event
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    const bookingId = parseInt(paymentIntent.metadata.bookingId);

    // Update transaction status
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', paymentIntent.id);

    if (txError) {
      console.error('Error updating transaction:', txError);
      return;
    }

    // Update booking status
    const { error: bookingError } = await supabaseAdmin
      .from('bookings')
      .update({
        payment_status: 'Paid',
        status: 'Confirmed',
        payment_date: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (bookingError) {
      console.error('Error updating booking:', bookingError);
      return;
    }

    console.log(`✅ Payment succeeded for booking #${bookingId}`);

    // TODO: Send confirmation email
    // TODO: Generate invoice

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

/**
 * Handle payment_intent.payment_failed event
 */
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    const bookingId = parseInt(paymentIntent.metadata.bookingId);

    // Update transaction status
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .update({
        status: 'failed',
        error_message: paymentIntent.last_payment_error?.message,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', paymentIntent.id);

    if (txError) {
      console.error('Error updating transaction:', txError);
      return;
    }

    // Update booking status
    const { error: bookingError } = await supabaseAdmin
      .from('bookings')
      .update({
        payment_status: 'Failed',
        status: 'Pending'
      })
      .eq('id', bookingId);

    if (bookingError) {
      console.error('Error updating booking:', bookingError);
      return;
    }

    console.log(`❌ Payment failed for booking #${bookingId}: ${paymentIntent.last_payment_error?.message}`);

    // TODO: Send failure notification email

  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

/**
 * Handle charge.refunded event
 */
async function handleChargeRefunded(charge) {
  try {
    // Find transaction by charge ID
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('transaction_id', charge.payment_intent)
      .single();

    if (txError || !transaction) {
      console.error('Transaction not found for refund');
      return;
    }

    // Update transaction
    const { error: updateError } = await supabaseAdmin
      .from('transactions')
      .update({
        status: 'refunded',
        refund_amount: charge.amount_refunded,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error('Error updating transaction for refund:', updateError);
      return;
    }

    console.log(`💰 Payment refunded: ${charge.amount_refunded} cents`);

  } catch (error) {
    console.error('Error handling refund:', error);
  }
}

/**
 * GET /api/payments/booking/:bookingId
 * Get payment status for a specific booking
 */
router.get('/booking/:bookingId', async (req, res) => {
  try {
    if (!checkSupabaseInit(req, res)) return;

    const { bookingId } = req.params;

    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('bookings')
      .select('*, transactions(*)')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      bookingId: booking.id,
      paymentStatus: booking.payment_status,
      amount: booking.amount,
      transaction: booking.transactions?.[0] || null
    });

  } catch (error) {
    console.error('❌ Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

/**
 * POST /api/payments/refund
 * Process a refund for a booking (Admin only)
 */
router.post('/refund', requirePermission('bookings_edit'), async (req, res) => {
  try {
    if (!checkSupabaseInit(req, res)) return;

    const { bookingId, reason } = req.body;

    if (!bookingId || !reason) {
      return res.status(400).json({
        error: 'Missing required fields: bookingId, reason'
      });
    }

    // Get latest transaction for booking
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('booking_id', bookingId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (txError || !transaction) {
      return res.status(404).json({ error: 'No completed payment found for this booking' });
    }

    // Create Stripe refund
    try {
      const refund = await stripeClient.refunds.create({
        payment_intent: transaction.transaction_id,
        reason: reason || 'requested_by_customer',
        metadata: {
          bookingId: String(bookingId)
        }
      });

      // Update transaction
      const { error: updateError } = await supabaseAdmin
        .from('transactions')
        .update({
          status: 'refunded',
          refund_amount: refund.amount,
          refund_reason: reason,
          refund_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error('Error updating transaction:', updateError);
        return res.status(500).json({ error: 'Failed to update transaction record' });
      }

      res.json({
        success: true,
        refundId: refund.id,
        amount: refund.amount
      });

    } catch (error) {
      console.error('Stripe refund error:', error);
      res.status(500).json({ 
        error: 'Failed to process refund',
        details: error.message
      });
    }

  } catch (error) {
    console.error('❌ Error processing refund:', error);
    res.status(500).json({ error: 'Refund processing failed' });
  }
});

/**
 * GET /api/payments/transactions
 * List all transactions (Admin only)
 */
router.get('/transactions', requirePermission('bookings_view'), async (req, res) => {
  try {
    if (!checkSupabaseInit(req, res)) return;

    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const { data: transactions, error, count } = await supabaseAdmin
      .from('transactions')
      .select('*, bookings(id, name, email, package)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * GET /api/payments/transactions/:id
 * Get transaction details
 */
router.get('/transactions/:id', requirePermission('bookings_view'), async (req, res) => {
  try {
    if (!checkSupabaseInit(req, res)) return;

    const { id } = req.params;

    const { data: transaction, error } = await supabaseAdmin
      .from('transactions')
      .select('*, bookings(*), transaction_audit_logs(*)')
      .eq('id', id)
      .single();

    if (error || !transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);

  } catch (error) {
    console.error('❌ Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

export default router;
