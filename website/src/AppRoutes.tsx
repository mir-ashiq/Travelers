import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Customer Auth Pages
import CustomerSignup from './pages/CustomerSignup';
import CustomerLogin from './pages/CustomerLogin';
import VerifyEmail from './pages/VerifyEmail';
import CustomerDashboard from './pages/CustomerDashboard';
import GuestPaymentPage from './pages/GuestPaymentPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import GalleryPage from './pages/GalleryPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Components
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import DestinationsAdmin from './admin/destinations/DestinationsPage';
import NewDestinationPage from './admin/destinations/NewDestinationPage';
import EditDestinationPage from './admin/destinations/EditDestinationPage';
import PackagesAdmin from './admin/packages/PackagesPage';
import NewPackagePage from './admin/packages/NewPackagePage';
import EditPackagePage from './admin/packages/EditPackagePage';
import BookingsAdmin from './admin/bookings/BookingsPage';
import TestimonialsAdmin from './admin/testimonials/TestimonialsPage';
import GalleryAdmin from './admin/gallery/GalleryPage';
import NewGalleryPage from './admin/gallery/NewGalleryPage';
import EditGalleryPage from './admin/gallery/EditGalleryPage';
import UsersAdmin from './admin/users/UsersPage';
import NewUserPage from './admin/users/NewUserPage';
import EditUserPage from './admin/users/EditUserPage';
import SettingsAdmin from './admin/settings/SettingsPage';
import NewTestimonialPage from './admin/testimonials/NewTestimonialPage';
import EditTestimonialPage from './admin/testimonials/EditTestimonialPage';
import ReportsPage from './admin/reports/ReportsPage';
import SupportPage from './admin/support/SupportPage';
import FAQPage from './admin/faq/FAQPage';
import BlogPage from './admin/blog/BlogPage';
import EditBlogPage from './admin/blog/EditBlogPage';
import Login from './admin/Login';

// Auth guard for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing while loading - prevents redirect before auth is restored
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Layout wrapper for frontend pages
const FrontendLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Auth Routes */}
      <Route path="/signup" element={<FrontendLayout><CustomerSignup /></FrontendLayout>} />
      <Route path="/login" element={<FrontendLayout><CustomerLogin /></FrontendLayout>} />
      <Route path="/verify-email" element={<FrontendLayout><VerifyEmail /></FrontendLayout>} />
      <Route path="/forgot-password" element={<FrontendLayout><ForgotPassword /></FrontendLayout>} />
      <Route path="/reset-password" element={<FrontendLayout><ResetPassword /></FrontendLayout>} />
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute>
            <FrontendLayout>
              <CustomerDashboard />
            </FrontendLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:bookingId"
        element={
          <FrontendLayout>
            <GuestPaymentPage />
          </FrontendLayout>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="" element={<Dashboard />} />
        <Route path="destinations" element={<DestinationsAdmin />} />
        <Route path="destinations/new" element={<NewDestinationPage />} />
        <Route path="destinations/edit/:id" element={<EditDestinationPage />} />
        <Route path="packages" element={<PackagesAdmin />} />
        <Route path="packages/new" element={<NewPackagePage />} />
        <Route path="packages/edit/:id" element={<EditPackagePage />} />
        <Route path="bookings" element={<BookingsAdmin />} />
        <Route path="gallery" element={<GalleryAdmin />} />
        <Route path="gallery/new" element={<NewGalleryPage />} />
        <Route path="gallery/edit/:id" element={<EditGalleryPage />} />
        <Route path="users" element={<UsersAdmin />} />
        <Route path="users/new" element={<NewUserPage />} />
        <Route path="users/edit/:id" element={<EditUserPage />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="testimonials/new" element={<NewTestimonialPage />} />
        <Route path="testimonials/edit/:id" element={<EditTestimonialPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/edit/:id" element={<EditBlogPage />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>

      {/* Frontend Routes */}
      <Route
        path="/"
        element={
          <FrontendLayout>
            <HomePage />
          </FrontendLayout>
        }
      />
      <Route
        path="/destinations"
        element={
          <FrontendLayout>
            <DestinationsPage />
          </FrontendLayout>
        }
      />
      <Route
        path="/destinations/:id"
        element={
          <FrontendLayout>
            <DestinationDetailPage />
          </FrontendLayout>
        }
      />
      <Route
        path="/packages"
        element={
          <FrontendLayout>
            <PackagesPage />
          </FrontendLayout>
        }
      />
      <Route
        path="/packages/:id"
        element={
          <FrontendLayout>
            <PackageDetailPage />
          </FrontendLayout>
        }
      />
      <Route
        path="/gallery"
        element={
          <FrontendLayout>
            <GalleryPage />
          </FrontendLayout>
        }
      />
      <Route
        path="/testimonials"
        element={
          <FrontendLayout>
            <TestimonialsPage />
          </FrontendLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <FrontendLayout>
            <ContactPage />
          </FrontendLayout>
        }
      />
      <Route
        path="/about"
        element={
          <FrontendLayout>
            <AboutPage />
          </FrontendLayout>
        }
      />

      {/* 404 Catch-all */}
      <Route
        path="*"
        element={
          <FrontendLayout>
            <NotFoundPage />
          </FrontendLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;


