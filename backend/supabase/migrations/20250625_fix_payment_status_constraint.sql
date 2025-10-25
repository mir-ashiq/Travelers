/*
# Fix Payment Status Constraint
# 
# The bookings table currently has a CHECK constraint that only allows:
# 'Paid', 'Pending', 'Failed'
#
# But the application uses: 'Paid', 'Pending', 'Refunded'
#
# This migration updates the constraint to match the application code.
*/

-- Drop the old constraint that only allows 'Paid', 'Pending', 'Failed'
ALTER TABLE public.bookings DROP CONSTRAINT bookings_payment_status_check;

-- Add the new constraint that allows 'Paid', 'Pending', 'Refunded'
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_payment_status_check 
CHECK (payment_status IN ('Paid', 'Pending', 'Refunded'));
