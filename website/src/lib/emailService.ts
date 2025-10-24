import { supabase } from './supabase';

interface EmailPayload {
  type: 'booking_confirmation' | 'status_update';
  customerName: string;
  customerEmail: string;
  packageName: string;
  bookingId: number;
  travelDate: string;
  amount: number;
  status?: string;
  adminEmail?: string;
}

/**
 * Generate email HTML template
 */
const getEmailTemplate = (payload: EmailPayload) => {
  if (payload.type === 'booking_confirmation') {
    return {
      subject: `Booking Confirmation - ${payload.packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Booking Confirmation</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>Dear ${payload.customerName},</p>
            <p>Thank you for booking with <strong>JKLG Travel Agency</strong>!</p>
            <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #667eea;">Your Booking Details</h2>
              <p><strong>Booking ID:</strong> #${payload.bookingId}</p>
              <p><strong>Package:</strong> ${payload.packageName}</p>
              <p><strong>Travel Date:</strong> ${new Date(payload.travelDate).toLocaleDateString()}</p>
              <p><strong>Amount:</strong> ₹${payload.amount.toLocaleString('en-IN')}</p>
              <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">PENDING</span></p>
            </div>
            <p>Our team will review your booking and contact you shortly.</p>
            <p style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <strong>JKLG Travel Agency</strong><br>
              Email: bookings@abctravels.site
            </p>
          </div>
        </div>
      `,
    };
  } else if (payload.type === 'status_update') {
    const statusColor =
      payload.status === 'Confirmed'
        ? '#10b981'
        : payload.status === 'Cancelled'
          ? '#ef4444'
          : '#f59e0b';
    const statusMessage =
      payload.status === 'Confirmed'
        ? 'Your booking has been confirmed!'
        : payload.status === 'Cancelled'
          ? 'Your booking has been cancelled.'
          : 'Your booking status has been updated.';

    return {
      subject: `Booking ${payload.status} - ${payload.packageName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Booking Status Update</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>Dear ${payload.customerName},</p>
            <div style="background: white; border-left: 4px solid ${statusColor}; padding: 20px; margin: 20px 0; text-align: center;">
              <h2 style="margin-top: 0; color: ${statusColor};">Status: ${payload.status}</h2>
              <p style="font-size: 16px; margin: 15px 0;">${statusMessage}</p>
            </div>
            <div style="background: white; border: 1px solid #e5e7eb; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Booking Information</h3>
              <p><strong>Booking ID:</strong> #${payload.bookingId}</p>
              <p><strong>Package:</strong> ${payload.packageName}</p>
              <p><strong>Travel Date:</strong> ${new Date(payload.travelDate).toLocaleDateString()}</p>
              <p><strong>Amount:</strong> ₹${payload.amount.toLocaleString('en-IN')}</p>
            </div>
            <p style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <strong>JKLG Travel Agency</strong><br>
              Email: bookings@abctravels.site
            </p>
          </div>
        </div>
      `,
    };
  }

  return { subject: 'Booking Notification', html: '<p>No email template found.</p>' };
};

/**
 * Store email in database for sending
 * This is more reliable than calling the Edge Function which requires JWT
 */
export const sendBookingEmail = async (payload: EmailPayload) => {
  try {
    const template = getEmailTemplate(payload);

    // Store email in email_history table
    const { data, error } = await supabase
      .from('email_history')
      .insert([
        {
          recipient_email: payload.customerEmail,
          recipient_name: payload.customerName,
          subject: template.subject,
          body: template.html,
          email_type: payload.type,
          related_to: 'booking',
          related_id: payload.bookingId,
          status: 'pending',
        },
      ])
      .select();

    if (error) {
      console.error('Failed to save email to database:', error);
      return false;
    }

    console.log('Email saved to email_history table:', data);
    return true;
  } catch (error) {
    console.error('Failed to save email:', error);
    return false;
  }
};

/**
 * Send booking confirmation email to customer
 */
export const sendBookingConfirmationEmail = async (
  customerName: string,
  customerEmail: string,
  packageName: string,
  bookingId: number,
  travelDate: string,
  amount: number
) => {
  return sendBookingEmail({
    type: 'booking_confirmation',
    customerName,
    customerEmail,
    packageName,
    bookingId,
    travelDate,
    amount,
  });
};

/**
 * Send status update email to customer
 */
export const sendStatusUpdateEmail = async (
  customerName: string,
  customerEmail: string,
  packageName: string,
  bookingId: number,
  travelDate: string,
  amount: number,
  newStatus: string,
  adminEmail?: string
) => {
  return sendBookingEmail({
    type: 'status_update',
    customerName,
    customerEmail,
    packageName,
    bookingId,
    travelDate,
    amount,
    status: newStatus,
    adminEmail,
  });
};
