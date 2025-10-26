import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../contexts/CustomerContext';
import { User, LogOut, Plus, Calendar, MapPin, DollarSign, Package, Edit, Menu, X } from 'lucide-react';

interface Booking {
  id: string;
  packageName: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  guests: number;
}

const CustomerDashboard: React.FC = () => {
  const { customer, logout } = useCustomer();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!customer) {
      navigate('/login');
      return;
    }

    // Fetch customer bookings
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customers/${customer.id}/bookings`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBookings(data.bookings || []);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [customer, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!customer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Travel Dashboard</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/packages')}
              className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Book New
            </button>
            <button
              onClick={() => navigate('/account')}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              <button
                onClick={() => {
                  navigate('/packages');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition"
              >
                <Plus className="inline w-4 h-4 mr-2" />
                Book New
              </button>
              <button
                onClick={() => {
                  navigate('/account');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
              >
                <User className="inline w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
              >
                <LogOut className="inline w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {customer.name}! 👋
              </h2>
              <p className="text-gray-600">
                Manage your bookings and plan your next adventure.
              </p>
            </div>
            <div className="hidden sm:block p-4 bg-indigo-100 rounded-full">
              <User className="w-12 h-12 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</p>
              </div>
              <Package className="w-12 h-12 text-indigo-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {bookings.filter((b) => b.status === 'confirmed').length}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-green-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${bookings.reduce((sum, b) => sum + b.totalPrice, 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-blue-100" />
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Your Bookings</h3>
              <button
                onClick={() => navigate('/packages')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
              >
                <Plus className="w-4 h-4" />
                New Booking
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h4>
              <p className="text-gray-600 mb-6">Start your adventure by booking your first package!</p>
              <button
                onClick={() => navigate('/packages')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition"
              >
                <Plus className="w-4 h-4" />
                Explore Packages
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-bold text-gray-900">{booking.packageName}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{booking.guests} guests</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-900 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          <span>${booking.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                      >
                        <Edit className="w-4 h-4" />
                        View
                      </button>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => navigate(`/payment/${booking.id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                        >
                          <DollarSign className="w-4 h-4" />
                          Pay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {bookings.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">Ready for your next adventure?</h3>
            <p className="text-indigo-100 mb-6">Explore our amazing packages and create unforgettable memories.</p>
            <button
              onClick={() => navigate('/packages')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 font-bold transition"
            >
              <Plus className="w-4 h-4" />
              Browse Packages
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
