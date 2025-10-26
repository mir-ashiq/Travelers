/**
 * Protected Route Component
 * Ensures only authenticated customers can access certain routes
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomer } from '../contexts/CustomerContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean; // If true, email must be verified
}

/**
 * Wrap routes that require customer authentication
 * 
 * Usage:
 * <ProtectedRoute>
 *   <CustomerDashboard />
 * </ProtectedRoute>
 * 
 * @param requireVerified - If true, only allows customers with verified email
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireVerified = false,
}) => {
  const { isAuthenticated, customer, isLoading } = useCustomer();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but email not verified
  if (requireVerified && !customer?.verified_at) {
    return <Navigate to="/verify-email" replace />;
  }

  // All checks passed - render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
