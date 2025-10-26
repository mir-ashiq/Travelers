import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomer } from '../contexts/CustomerContext';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface BookingDetails {
  id: string;
  packageName: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  guests: number;
}

const PaymentFormContent: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { customer } = useCustomer();
  const stripe = useStripe();
  const elements = useElements();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [billingDetails, setBillingDetails] = useState({
    fullName: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  useEffect(() => {
    // Fetch booking details
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/customers/${customer?.id}/bookings/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBooking(data.booking);
        } else {
          setError('Failed to load booking details');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (customer && bookingId) {
      fetchBooking();
    }
  }, [customer, bookingId]);

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !booking) {
      setError('Payment system not initialized');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const paymentIntentResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            bookingId: booking.id,
            amount: Math.round(booking.totalPrice * 100),
            currency: 'usd',
          }),
        }
      );

      if (!paymentIntentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await paymentIntentResponse.json();

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billingDetails.fullName,
              email: billingDetails.email,
              phone: billingDetails.phone,
              address: {
                line1: billingDetails.address,
                city: billingDetails.city,
                state: billingDetails.state,
                postal_code: billingDetails.zipCode,
                country: billingDetails.country,
              },
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        toast.error('Payment failed. Please try again.');
      } else if (paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        toast.success('Payment successful! 🎉');

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/customer-dashboard');
        }, 3000);
      } else {
        setError('Payment processing failed');
        toast.error('Payment processing failed');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking not found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the booking you're looking for.</p>
          <button
            onClick={() => navigate('/customer-dashboard')}
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h2>
          <p className="text-gray-600 mb-2">Your booking has been confirmed.</p>
          <p className="text-gray-600 mb-8">Redirecting to dashboard...</p>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/customer-dashboard')}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium transition"
        >
          ← Back to Dashboard
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Package</p>
                  <p className="font-semibold text-gray-900">{booking.packageName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-semibold text-gray-900">{booking.destination}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Travel Dates</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(booking.startDate).toLocaleDateString()} -
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Number of Guests</p>
                  <p className="font-semibold text-gray-900">{booking.guests}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="text-gray-900 font-medium">$0.00</span>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Details</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-900">Payment Error</p>
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Billing Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={billingDetails.fullName}
                        onChange={handleBillingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={billingDetails.email}
                        onChange={handleBillingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={billingDetails.phone}
                      onChange={handleBillingChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={billingDetails.address}
                      onChange={handleBillingChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={billingDetails.city}
                        onChange={handleBillingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                        placeholder="New York"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={billingDetails.state}
                        onChange={handleBillingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={billingDetails.zipCode}
                        onChange={handleBillingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                        placeholder="10001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={billingDetails.country}
                        onChange={handleBillingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Card Details
                  </h3>

                  <div className="border-2 border-gray-300 rounded-lg p-4 focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                              color: '#aab7c4',
                            },
                          },
                          invalid: {
                            color: '#fa755a',
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {/* Security Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Your payment information is secure and encrypted</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={processing || !stripe}
                  className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Pay ${booking.totalPrice.toFixed(2)}
                    </>
                  )}
                </button>

                {/* Terms */}
                <p className="text-xs text-gray-500 text-center">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

  if (!stripeKey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-gray-600">Stripe public key is not configured.</p>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent />
    </Elements>
  );
};

export default PaymentPage;
