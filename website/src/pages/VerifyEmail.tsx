/**
 * Email Verification Page
 * Handles email verification after signup or resends verification
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { useCustomer } from '../contexts/CustomerContext';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface LocationState {
  email?: string;
}

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerification, isLoading, error, clearError, customer } =
    useCustomer();

  const locationState = location.state as LocationState | undefined;
  const email = locationState?.email || '';
  const tokenParam = searchParams.get('token');
  const customerIdParam = searchParams.get('customerId');

  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Auto-verify if token and customerId in URL
  useEffect(() => {
    if (tokenParam && customerIdParam && !verified && !verifyError) {
      handleAutoVerify();
    }
  }, [tokenParam, customerIdParam]);

  // Auto-verify function
  const handleAutoVerify = async () => {
    try {
      clearError();
      await verifyEmail(customerIdParam!, tokenParam!);
      setVerified(true);
    } catch (err: any) {
      setVerifyError(err?.message || 'Verification failed');
    }
  };

  // Resend verification email
  const handleResend = async () => {
    if (!email) {
      setVerifyError('Email address is required');
      return;
    }

    try {
      setResendLoading(true);
      clearError();
      await resendVerification(email);
      setResendSuccess(true);

      // Reset message after 5 seconds
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setVerifyError(err?.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  // If already verified
  if (verified || (customer?.verified_at && !verifyError)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-6">
            Your email has been verified successfully. You can now log in to your account.
          </p>
          <button
            onClick={() => navigate('/login', { state: { email } })}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a verification link to<br />
            <span className="font-medium">{email || 'your email'}</span>
          </p>
        </div>

        {/* Error Alert */}
        {(error || verifyError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">{error?.message || verifyError}</p>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {resendSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-900">
              ✓ Verification email sent successfully. Check your inbox!
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-medium text-gray-900 mb-2">What to do next:</h2>
          <ol className="text-sm text-gray-700 space-y-2">
            <li>1. Check your email inbox (and spam folder)</li>
            <li>2. Click the verification link in the email</li>
            <li>3. You'll be taken back here to confirm</li>
          </ol>
        </div>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={resendLoading || isLoading}
          className="w-full mb-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
        >
          {(resendLoading || isLoading) && <Loader className="h-5 w-5 animate-spin" />}
          {resendLoading ? 'Sending...' : 'Resend Verification Email'}
        </button>

        {/* Manual Verify Option */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or check your email first</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="mb-3">
            If you already clicked the verification link in your email, you should be verified
            automatically. Try logging in below.
          </p>

          <Link
            to="/login"
            state={{ email }}
            className="text-blue-600 hover:text-blue-700 font-medium block text-center"
          >
            Go to Login →
          </Link>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Wrong email?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up with another email
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
