import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
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
import PackagesAdmin from './admin/packages/PackagesPage';
import BookingsAdmin from './admin/bookings/BookingsPage';
import TestimonialsAdmin from './admin/testimonials/TestimonialsPage';
import SettingsAdmin from './admin/settings/SettingsPage';
import Login from './admin/Login';

// Auth guard for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, check if user is logged in from context or localStorage
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="destinations" element={<DestinationsAdmin />} />
        <Route path="packages" element={<PackagesAdmin />} />
        <Route path="bookings" element={<BookingsAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
        {/* Additional admin routes */}
        <Route path="reports" element={<Dashboard />} />
        <Route path="support" element={<Dashboard />} />
        <Route path="faq" element={<Dashboard />} />
        <Route path="blog" element={<Dashboard />} />
        <Route path="users" element={<Dashboard />} />
        <Route path="gallery" element={<Dashboard />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
      
      {/* Frontend Routes */}
      <Route path="/" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route index element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
      
      <Route path="/destinations" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <DestinationsPage />
          </main>
          <Footer />
        </div>
      } />
      
      <Route path="/packages" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <PackagesPage />
          </main>
          <Footer />
        </div>
      } />
      
      <Route path="/packages/:id" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <PackageDetailPage />
          </main>
          <Footer />
        </div>
      } />
      
      <Route path="/gallery" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <GalleryPage />
          </main>
          <Footer />
        </div>
      } />
      
      <Route path="/testimonials" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <TestimonialsPage />
          </main>
          <Footer />
        </div>
      } />
      
      <Route path="/contact" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <ContactPage />
          </main>
          <Footer />
        </div>
      } />
      
      <Route path="/about" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AboutPage />
          </main>
          <Footer />
        </div>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <NotFoundPage />
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  );
}

export default App;