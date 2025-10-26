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
import { 
  CreditCard, 
  Lock, 
  AlertCircle, 
  CheckCircle, 
  Eye, 
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';

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

const GuestPaymentFormContent: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { customer, login, isAuthenticated } = useCustomer();
  const stripe = useStripe();
  const elements = useElements();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'auth' | 'billing' | 'payment'>('auth');

  // Auth state (for guest or existing customers)
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    isNewCustomer: false,
    name: '',
    phone: '',
  });

  // Billing details
  const [billingDetails, setBillingDetails] = useState({
    fullName: customer?.name || authForm.name || '',
    email: customer?.email || authForm.email || '',
    phone: customer?.phone || authForm.phone || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  // Redirect if already authenticated and booking loaded
  useEffect(() => {
    if (isAuthenticated && booking) {
      setStep('billing');
    }
  }, [isAuthenticated, booking]);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`
        );

        if (response.ok) {
          const data = await response.json();
          setBooking(data.booking || data);
        } else {
          setError('Failed to load booking details');
          toast.error('Booking not found');
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handleAuthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setAuthForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login or continue as guest
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (authForm.isNewCustomer) {
        // Create guest checkout record (no registration)
        setBillingDetails((prev) => ({
          ...prev,
          fullName: authForm.name,
          email: authForm.email,
          phone: authForm.phone,
        }));
        toast.success('Proceeding as guest');
        setStep('billing');
      } else {
        // Login existing customer
        setProcessing(true);
        await login(authForm.email, authForm.password);
        toast.success('Logged in successfully');
        setStep('billing');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !booking) {
      setError('Payment system not initialized');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Validate billing details
      if (!billingDetails.fullName || !billingDetails.email || !billingDetails.address) {
        setError('Please fill in all required billing fields');
        setProcessing(false);
        return;
      }

      // Create payment intent
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(customer && { Authorization: `Bearer ${localStorage.getItem('token')}` }),
          },
          body: JSON.stringify({
            bookingId: booking.id,
            amount: Math.round(booking.totalPrice * 100),
            email: billingDetails.email,
            name: billingDetails.fullName,
            phone: billingDetails.phone,
            address: billingDetails.address,
            city: billingDetails.city,
            state: billingDetails.state,
            zipCode: billingDetails.zipCode,
            country: billingDetails.country,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
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
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setSuccess(true);
        toast.success('Payment successful!');
        setTimeout(() => {
          navigate(isAuthenticated ? '/customer-dashboard' : '/');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      toast.error(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">The booking you're trying to pay for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-2">Thank you for your booking.</p>
          <p className="text-sm text-gray-500 mb-6">
            A confirmation email has been sent to {billingDetails.email}
          </p>
          <button
            onClick={() => navigate(isAuthenticated ? '/customer-dashboard' : '/')}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            {isAuthenticated ? 'View Dashboard' : 'Back to Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-600">Package</p>
                  <p className="font-semibold text-gray-900">{booking.packageName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-semibold text-gray-900">{booking.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dates</p>
                  <p className="font-semibold text-gray-900">
                    {booking.startDate} to {booking.endDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="font-semibold text-gray-900">{booking.guests} person(s)</p>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${booking.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>${booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Step 1: Authentication */}
              {step === 'auth' && !isAuthenticated && (
                <form onSubmit={handleAuthSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Checkout</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="isNewCustomer"
                            checked={!authForm.isNewCustomer}
                            onChange={() =>
                              setAuthForm((prev) => ({
                                ...prev,
                                isNewCustomer: false,
                              }))
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-gray-700">I have an existing account</span>
                        </label>
                      </div>

                      {!authForm.isNewCustomer && (
                        <div className="ml-7 space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={authForm.email}
                              onChange={handleAuthChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                              placeholder="your@email.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Password *
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={authForm.password}
                                onChange={handleAuthChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                                placeholder="••••••••"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="isNewCustomer"
                            checked={authForm.isNewCustomer}
                            onChange={() =>
                              setAuthForm((prev) => ({
                                ...prev,
                                isNewCustomer: true,
                              }))
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-gray-700">I'm a new customer (Guest checkout)</span>
                        </label>
                      </div>

                      {authForm.isNewCustomer && (
                        <div className="ml-7 space-y-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={authForm.name}
                              onChange={handleAuthChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={authForm.email}
                              onChange={handleAuthChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                              placeholder="your@email.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={authForm.phone}
                              onChange={handleAuthChange}
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                              placeholder="+1 (555) 000-0000"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 font-medium"
                  >
                    {processing ? 'Processing...' : 'Continue to Billing'}
                  </button>
                </form>
              )}

              {/* Step 2: Billing Details */}
              {step === 'billing' && (
                <form onSubmit={() => setStep('payment')} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Billing Address</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={billingDetails.fullName}
                          onChange={handleBillingChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={billingDetails.email}
                          onChange={handleBillingChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={billingDetails.phone}
                          onChange={handleBillingChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={billingDetails.address}
                          onChange={handleBillingChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="123 Main St"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={billingDetails.city}
                          onChange={handleBillingChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="New York"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={billingDetails.state}
                          onChange={handleBillingChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="NY"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={billingDetails.zipCode}
                          onChange={handleBillingChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                          placeholder="10001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={billingDetails.country}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('auth')}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-medium"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Payment */}
              {step === 'payment' && (
                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Information *
                      </label>
                      <div className="p-4 border border-gray-300 rounded-lg bg-white">
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
                                color: '#9e2146',
                              },
                            },
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                      <Lock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        Your payment information is secure and encrypted with Stripe.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep('billing')}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={processing || !stripe}
                      className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 font-medium inline-flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      {processing ? 'Processing...' : `Pay $${booking.totalPrice.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GuestPaymentPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <GuestPaymentFormContent />
    </Elements>
  );
};

export default GuestPaymentPage;
