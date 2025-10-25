import { useState, useEffect } from 'react';
import { 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Download,
  Printer,
  ChevronDown,
  ArrowDownToLine,
  RefreshCw,
  Sliders,
  ChevronsUpDown,
  Users,
  Mail,
  Phone,
  FileText,
  ChevronUp,
  TrendingUp,
  Globe,
  X,
  UserCheck,
  DollarSign
} from 'lucide-react';
import { supabase, Booking } from '../../lib/supabase';
import { sendStatusUpdateEmail } from '../../lib/emailService';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<number[]>([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'ascending' | 'descending'} | null>(null);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [reassignDropdownOpen, setReassignDropdownOpen] = useState(false);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from the database
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setBookings(data);
        setFilteredBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500); // Simulate loading delay
    }
  };

  // Apply filters
  useEffect(() => {
    setLoading(true);
    let results = [...bookings];
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(booking => 
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm)
      );
    }
    
    // Filter by status
    if (statusFilter) {
      results = results.filter(booking => booking.status === statusFilter);
    }
    
    // Filter by date range
    if (dateRange) {
      const today = new Date();
      if (dateRange === 'upcoming') {
        results = results.filter(booking => new Date(booking.travel_date) > today);
      } else if (dateRange === 'past') {
        results = results.filter(booking => new Date(booking.travel_date) < today);
      } else if (dateRange === 'recent') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        results = results.filter(booking => new Date(booking.booking_date) > sevenDaysAgo);
      }
    }
    
    // Filter by payment status
    if (paymentFilter) {
      results = results.filter(booking => booking.payment_status === paymentFilter);
    }
    
    // Filter by source
    if (sourceFilter) {
      results = results.filter(booking => booking.source === sourceFilter);
    }
    
    // Filter by assignee
    if (assigneeFilter) {
      if (assigneeFilter === 'unassigned') {
        results = results.filter(booking => !booking.assigned_to || booking.assigned_to === 'Unassigned');
      } else {
        results = results.filter(booking => booking.assigned_to === assigneeFilter);
      }
    }
    
    // Apply sorting
    if (sortConfig) {
      const { key, direction } = sortConfig;
      results.sort((a, b) => {
        const aValue = a[key as keyof typeof a] ?? '';
        const bValue = b[key as keyof typeof b] ?? '';
        
        if (aValue < bValue) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setFilteredBookings(results);
      setLoading(false);
      
      // Reset selection when filter changes
      setSelectedBookings([]);
      setIsSelectAll(false);
    }, 500);
  }, [searchTerm, statusFilter, dateRange, paymentFilter, sourceFilter, assigneeFilter, sortConfig, bookings]);

  // Handle select all
  useEffect(() => {
    if (isSelectAll) {
      setSelectedBookings(filteredBookings.map(booking => booking.id));
    } else {
      setSelectedBookings([]);
    }
  }, [isSelectAll, filteredBookings]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateRange('');
    setPaymentFilter('');
    setSourceFilter('');
    setAssigneeFilter('');
    setSortConfig(null);
  };

  // View booking details
  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  // Close booking details modal
  const closeModal = () => {
    setSelectedBooking(null);
  };

  // Update booking status
  const updateStatus = async (id: number, status: string) => {
    try {
      // Get booking details
      const booking = bookings.find(b => b.id === id);
      if (!booking) throw new Error('Booking not found');

      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === id ? {...b, status: status as 'Pending' | 'Confirmed' | 'Cancelled'} : b
        )
      );
      
      // If the booking is currently selected, update its status in the modal
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({...selectedBooking, status} as Booking);
      }

      // Send status update email (non-blocking)
      sendStatusUpdateEmail(
        booking.name,
        booking.email,
        booking.package,
        booking.id,
        booking.travel_date,
        booking.amount,
        status
      ).catch((err) => console.error('Email sending failed (non-blocking):', err));

      toast.success(`Booking status updated to ${status}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };
  
  // Bulk update status
  const bulkUpdateStatus = async (status: string) => {
    if (!selectedBookings.length) return;
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .in('id', selectedBookings);
      
      if (error) throw error;
      
      // Update local state and send emails for each booking
      setBookings(prevBookings => {
        const updatedBookings = prevBookings.map(booking => 
          selectedBookings.includes(booking.id) ? {...booking, status: status as 'Pending' | 'Confirmed' | 'Cancelled'} : booking
        );
        
        // Send emails for all updated bookings (non-blocking)
        updatedBookings.forEach(booking => {
          if (selectedBookings.includes(booking.id)) {
            sendStatusUpdateEmail(
              booking.name,
              booking.email,
              booking.package,
              booking.id,
              booking.travel_date,
              booking.amount,
              status
            ).catch((err) => console.error('Email sending failed (non-blocking):', err));
          }
        });
        
        return updatedBookings;
      });
      
      // Reset selection after bulk action
      setSelectedBookings([]);
      setIsSelectAll(false);
      setBulkActionOpen(false);
      
      toast.success(`${selectedBookings.length} bookings updated to ${status}`);
    } catch (error) {
      console.error('Error bulk updating bookings:', error);
      toast.error('Failed to update bookings');
    }
  };

  // Bulk export selected bookings as CSV
  const bulkExportBookings = () => {
    if (!selectedBookings.length) {
      toast.error('No bookings selected');
      return;
    }

    try {
      const selectedData = bookings.filter(booking => selectedBookings.includes(booking.id));
      
      // Prepare CSV headers
      const headers = ['ID', 'Customer Name', 'Email', 'Phone', 'Package', 'Travel Date', 'Amount', 'Payment Status', 'Booking Status', 'Assigned To', 'Source', 'Notes'];
      
      // Prepare CSV rows
      const rows = selectedData.map(booking => [
        booking.id,
        booking.name,
        booking.email,
        booking.phone,
        booking.package,
        formatDate(booking.travel_date),
        booking.amount,
        booking.payment_status,
        booking.status,
        booking.assigned_to || 'Unassigned',
        booking.source || 'N/A',
        booking.notes || ''
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `bookings-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSelectedBookings([]);
      setIsSelectAll(false);
      setBulkActionOpen(false);
      
      toast.success(`${selectedBookings.length} bookings exported successfully`);
    } catch (error) {
      console.error('Error exporting bookings:', error);
      toast.error('Failed to export bookings');
    }
  };

  // Bulk delete selected bookings
  const bulkDeleteBookings = async () => {
    if (!selectedBookings.length) {
      toast.error('No bookings selected');
      return;
    }

    // Confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedBookings.length} booking(s)? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      // Call backend DELETE endpoint instead of direct Supabase call
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/bookings/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedBookings })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          toast.error('You do not have permission to delete bookings');
          return;
        }
        throw new Error(errorData.error || 'Failed to delete bookings');
      }

      await response.json();

      // Update local state
      setBookings(prevBookings =>
        prevBookings.filter(booking => !selectedBookings.includes(booking.id))
      );
      setFilteredBookings(prevFiltered =>
        prevFiltered.filter(booking => !selectedBookings.includes(booking.id))
      );

      // Reset selection after bulk action
      setSelectedBookings([]);
      setIsSelectAll(false);
      setBulkActionOpen(false);

      toast.success(`${selectedBookings.length} booking(s) deleted successfully`);
    } catch (error) {
      console.error('Error deleting bookings:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete bookings');
    } finally {
      setLoading(false);
    }
  };

  // Handle single booking selection
  const toggleSelectBooking = (id: number) => {
    setSelectedBookings(prev => 
      prev.includes(id)
        ? prev.filter(bookingId => bookingId !== id)
        : [...prev, id]
    );
  };

  // Apply sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort direction for a column
  const getSortDirection = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction;
  };
  
  // Render sort indicator
  const renderSortIndicator = (key: string) => {
    const direction = getSortDirection(key);
    if (!direction) {
      return <ChevronsUpDown size={14} className="ml-1 text-gray-400" />;
    }
    return direction === 'ascending' 
      ? <ChevronUp size={14} className="ml-1 text-primary-600" /> 
      : <ChevronDown size={14} className="ml-1 text-primary-600" />;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get unique sources for filter
  const sources = [...new Set(bookings.map(b => b.source))];
  
  // Get unique assignees for filter
  const assignees = [...new Set(bookings.filter(b => b.assigned_to).map(b => b.assigned_to as string))];

  // Function to refresh data
  const refreshData = () => {
    fetchBookings();
  };

  // Format date
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY-MM-DD');
  };

  // Send reminder email to customer
  const sendReminderEmail = async (booking: Booking) => {
    try {
      // Use existing email service to send reminder
      await sendStatusUpdateEmail(
        booking.name,
        booking.email,
        booking.package,
        booking.id,
        booking.travel_date,
        booking.amount,
        'Reminder' // Special status for reminder emails
      );
      toast.success('Reminder email sent to customer');
    } catch (error) {
      console.error('Error sending reminder email:', error);
      toast.error('Failed to send reminder email');
    }
  };

  // Generate invoice PDF
  const generateInvoice = async (booking: Booking) => {
    try {
      // Create invoice HTML content
      const invoiceHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #333;">INVOICE</h1>
          <hr style="margin: 20px 0;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div>
              <h3 style="margin: 0; color: #666;">JKLG Travel Agency</h3>
              <p style="margin: 5px 0; color: #999;">Professional Travel Services</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> #${booking.id}</p>
              <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(booking.booking_date)}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h4 style="color: #333;">Bill To:</h4>
            <p style="margin: 5px 0;"><strong>${booking.name}</strong></p>
            <p style="margin: 5px 0;">Email: ${booking.email}</p>
            <p style="margin: 5px 0;">Phone: ${booking.phone}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr style="background-color: #f5f5f5; border-bottom: 2px solid #ddd;">
              <th style="padding: 10px; text-align: left;">Description</th>
              <th style="padding: 10px; text-align: right;">Amount</th>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px;">
                <strong>${booking.package}</strong><br>
                Travel Date: ${formatDate(booking.travel_date)}
              </td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">₹${booking.amount.toLocaleString('en-IN')}</td>
            </tr>
            <tr style="background-color: #f9f9f9; border-top: 2px solid #ddd;">
              <td style="padding: 10px; text-align: right; font-weight: bold;">TOTAL:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">₹${booking.amount.toLocaleString('en-IN')}</td>
            </tr>
          </table>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 0; color: #666;"><strong>Status:</strong> ${booking.status}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Payment Status:</strong> ${booking.payment_status}</p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 15px; color: #999; font-size: 12px;">
            <p style="margin: 5px 0;">Thank you for booking with JKLG Travel Agency!</p>
            <p style="margin: 5px 0;">For inquiries, contact us at support@jklgtravel.com</p>
          </div>
        </div>
      `;
      
      // Create a new window and print it as PDF
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
        printWindow.print();
        toast.success('Invoice opened for printing/saving as PDF');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    }
  };

  // Download invoice as PDF
  const downloadInvoice = async (booking: Booking) => {
    try {
      // Create invoice HTML
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Invoice #${booking.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; color: #333; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
              th { background-color: #f5f5f5; }
              .total { font-weight: bold; font-size: 16px; }
            </style>
          </head>
          <body>
            <h1>INVOICE</h1>
            <p><strong>Booking ID:</strong> #${booking.id}</p>
            <p><strong>Date:</strong> ${formatDate(booking.booking_date)}</p>
            
            <h3>Bill To:</h3>
            <p>${booking.name}<br>${booking.email}<br>${booking.phone}</p>
            
            <table>
              <tr>
                <th>Description</th>
                <th>Amount</th>
              </tr>
              <tr>
                <td>${booking.package}<br>Travel: ${formatDate(booking.travel_date)}</td>
                <td>₹${booking.amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td class="total">TOTAL:</td>
                <td class="total">₹${booking.amount.toLocaleString('en-IN')}</td>
              </tr>
            </table>
            
            <p><strong>Status:</strong> ${booking.status}</p>
            <p><strong>Payment Status:</strong> ${booking.payment_status}</p>
          </body>
        </html>
      `;
      
      // Create blob and download
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${booking.id}_${formatDate(booking.booking_date)}.html`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  // Assign booking to team member
  const assignBooking = async (id: number, assignee: string) => {
    try {
      // Use backend API to bypass Supabase schema cache issues
      const response = await fetch('http://localhost:3000/api/bookings/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, assigned_to: assignee }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to assign booking');
      }

      // Update local state
      setBookings(bookings.map(booking => {
        if (booking.id === id) {
          return {...booking, assigned_to: assignee};
        }
        return booking;
      }));
      
      // Update selected booking if it's the one being modified
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({
          ...selectedBooking,
          assigned_to: assignee
        });
      }
      
      toast.success(`Booking assigned to ${assignee}`);
    } catch (error) {
      console.error('Error assigning booking:', error);
      toast.error('Failed to assign booking');
    }
  };

  const updatePayment = async (id: number, paymentStatus: 'Paid' | 'Pending' | 'Refunded') => {
    try {
      // Use backend API to update payment
      const response = await fetch('http://localhost:3000/api/bookings/update-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, payment_status: paymentStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update payment');
      }

      // Update local state
      setBookings(bookings.map(booking => {
        if (booking.id === id) {
          return {...booking, payment_status: paymentStatus};
        }
        return booking;
      }));
      
      // Update selected booking if it's the one being modified
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({
          ...selectedBooking,
          payment_status: paymentStatus
        });
      }
      
      toast.success(`Payment status updated to ${paymentStatus}`);
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment');
    }
  };

  // Calculate statistics
  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter(b => b.status === 'Confirmed').length,
    pending: filteredBookings.filter(b => b.status === 'Pending').length,
    cancelled: filteredBookings.filter(b => b.status === 'Cancelled').length,
    revenue: filteredBookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + b.amount, 0)
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Bookings</h1>
          <p className="text-gray-600">View and manage all customer bookings</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center"
            title="Export to Excel"
          >
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center"
            title="Print bookings"
          >
            <Printer size={18} className="mr-2" />
            Print
          </button>
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
            onClick={refreshData}
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FileText size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckCircle size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-primary-600">
                ₹{stats.revenue.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Filters</h3>
          <button
            className="text-sm text-primary-600 hover:text-primary-700 focus:outline-none"
            onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
          >
            <div className="flex items-center">
              <Sliders size={14} className="mr-1" />
              {isAdvancedFilterOpen ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </div>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or package..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="md:w-52 relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          
          <div className="md:w-52 relative">
            <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Dates</option>
              <option value="upcoming">Upcoming Travel</option>
              <option value="past">Past Travel</option>
              <option value="recent">Recent Bookings</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {isAdvancedFilterOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FileText size={16} />
                </div>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Payment Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Refunded">Refunded</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Globe size={16} />
                </div>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Sources</option>
                  {sources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <UserCheck size={16} />
                </div>
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Assignees</option>
                  <option value="unassigned">Unassigned</option>
                  {assignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          {(searchTerm || statusFilter || dateRange || paymentFilter || sourceFilter || assigneeFilter) && (
            <button
              onClick={clearFilters}
              className="text-sm flex items-center px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <X size={14} className="mr-1" />
              Clear Filters
            </button>
          )}
          
          <div className="text-sm text-gray-500">
            {loading ? 'Loading...' : `Showing ${filteredBookings.length} of ${bookings.length} bookings`}
          </div>
        </div>
      </div>
      
      {/* Bulk Actions */}
      {selectedBookings.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium text-blue-700">{selectedBookings.length} bookings selected</span>
            <button 
              className="ml-4 text-gray-700 hover:text-gray-900"
              onClick={() => {
                setSelectedBookings([]);
                setIsSelectAll(false);
              }}
            >
              Clear selection
            </button>
          </div>
          <div className="relative">
            <button 
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center"
              onClick={() => setBulkActionOpen(!bulkActionOpen)}
            >
              Bulk Actions
              <ChevronDown size={16} className="ml-1" />
            </button>
            
            {bulkActionOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white z-20">
                <div className="py-1">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => bulkUpdateStatus('Confirmed')}
                  >
                    Confirm Selected
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => bulkUpdateStatus('Cancelled')}
                  >
                    Cancel Selected
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => bulkExportBookings()}
                  >
                    Export Selected
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => bulkDeleteBookings()}
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelectAll}
                        onChange={() => setIsSelectAll(!isSelectAll)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('name')}
                    >
                      Customer {renderSortIndicator('name')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('package')}
                    >
                      Package {renderSortIndicator('package')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('travel_date')}
                    >
                      Travel Date {renderSortIndicator('travel_date')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('amount')}
                    >
                      Amount {renderSortIndicator('amount')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('payment_status')}
                    >
                      Payment {renderSortIndicator('payment_status')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="flex items-center focus:outline-none"
                      onClick={() => requestSort('status')}
                    >
                      Status {renderSortIndicator('status')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={() => toggleSelectBooking(booking.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{booking.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail size={12} className="mr-1" />
                        {booking.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone size={12} className="mr-1" />
                        {booking.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{booking.package}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        Booked on: {formatDate(booking.booking_date)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Users size={12} className="mr-1" />
                        Assigned: {booking.assigned_to || 'Unassigned'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-500 mr-1" />
                        <span className="text-sm text-gray-900">
                          {formatDate(booking.travel_date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        ₹{booking.amount.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                      <div className="flex justify-end">
                        <button 
                          className="p-1 text-primary-600 hover:text-primary-900"
                          onClick={() => viewBookingDetails(booking)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {booking.status === 'Pending' && (
                          <>
                            <button 
                              className="p-1 text-green-600 hover:text-green-900"
                              onClick={() => updateStatus(booking.id, 'Confirmed')}
                              title="Confirm Booking"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:text-red-900"
                              onClick={() => updateStatus(booking.id, 'Cancelled')}
                              title="Cancel Booking"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        
                        {/* Download invoice */}
                        <button 
                          className="p-1 text-gray-600 hover:text-gray-900"
                          title="Download Invoice"
                          onClick={() => downloadInvoice(booking)}
                        >
                          <ArrowDownToLine size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle size={40} className="text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" disabled>
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" disabled>
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredBookings.length}</span> of{' '}
                <span className="font-medium">{filteredBookings.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  disabled
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  1
                </button>
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  disabled
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                        <FileText size={20} className="mr-2 text-primary-600" />
                        Booking Details
                      </h3>
                      <button 
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Booking ID:</span>
                        <span className="font-medium">#{selectedBooking.id}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Payment Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedBooking.payment_status)}`}>
                          {selectedBooking.payment_status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h4>
                        <div className="bg-white p-4 border border-gray-200 rounded-lg">
                          <p className="font-medium">{selectedBooking.name}</p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Mail size={14} className="mr-1" />
                            {selectedBooking.email}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Phone size={14} className="mr-1" />
                            {selectedBooking.phone}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Package Details</h4>
                        <div className="bg-white p-4 border border-gray-200 rounded-lg">
                          <p className="font-medium">{selectedBooking.package}</p>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Calendar size={14} className="mr-1" />
                            <span>Travel Date: {formatDate(selectedBooking.travel_date)}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1 font-medium">
                            Amount: ₹{selectedBooking.amount.toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="text-gray-500">Source:</span> {selectedBooking.source}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedBooking.message && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
                        <div className="bg-white p-4 border border-gray-200 rounded-lg">
                          <p className="text-gray-700">{selectedBooking.message}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Assignment</h4>
                      <div className="bg-white p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <UserCheck size={16} className="text-gray-500 mr-2" />
                          <span>Assigned to: <span className="font-medium">{selectedBooking.assigned_to || 'Unassigned'}</span></span>
                        </div>
                        <div className="relative">
                          <button 
                            onClick={() => setReassignDropdownOpen(!reassignDropdownOpen)}
                            className="text-primary-600 text-sm hover:underline flex items-center"
                          >
                            Reassign
                            <ChevronDown size={16} className="ml-1" />
                          </button>
                          {/* Dropdown menu */}
                          {reassignDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white z-20 border border-gray-200">
                              <div className="py-1">
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    assignBooking(selectedBooking.id, 'Unassigned');
                                    setReassignDropdownOpen(false);
                                  }}
                                >
                                  Unassigned
                                </button>
                                {assignees.map(assignee => (
                                  <button
                                    key={assignee}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      assignBooking(selectedBooking.id, assignee);
                                      setReassignDropdownOpen(false);
                                    }}
                                  >
                                    {assignee}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Payment</h4>
                      <div className="bg-white p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign size={16} className="text-gray-500 mr-2" />
                          <span>Status: <span className={`font-medium ${selectedBooking.payment_status === 'Paid' ? 'text-green-600' : selectedBooking.payment_status === 'Refunded' ? 'text-red-600' : 'text-yellow-600'}`}>{selectedBooking.payment_status}</span></span>
                        </div>
                        <div className="relative">
                          <button 
                            onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
                            className="text-primary-600 text-sm hover:underline flex items-center"
                          >
                            Update
                            <ChevronDown size={16} className="ml-1" />
                          </button>
                          {/* Payment Status Dropdown */}
                          {paymentDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-40 rounded-md shadow-lg bg-white z-20 border border-gray-200">
                              <div className="py-1">
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    updatePayment(selectedBooking.id, 'Paid');
                                    setPaymentDropdownOpen(false);
                                  }}
                                >
                                  Mark as Paid
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    updatePayment(selectedBooking.id, 'Pending');
                                    setPaymentDropdownOpen(false);
                                  }}
                                >
                                  Mark as Pending
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    updatePayment(selectedBooking.id, 'Refunded');
                                    setPaymentDropdownOpen(false);
                                  }}
                                >
                                  Mark as Refunded
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Booking Timeline</h4>
                      <div className="bg-white p-4 border border-gray-200 rounded-lg">
                        <div className="relative pl-8 pb-4 border-l-2 border-gray-200">
                          <div className="absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Booking Created</p>
                            <p className="text-sm text-gray-600">{formatDate(selectedBooking.booking_date)}</p>
                          </div>
                        </div>
                        
                        {selectedBooking.status === 'Confirmed' && (
                          <div className="relative pl-8 pb-0 border-l-2 border-gray-200">
                            <div className="absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">Booking Confirmed</p>
                              <p className="text-sm text-gray-600">{formatDate(selectedBooking.booking_date)}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedBooking.status === 'Cancelled' && (
                          <div className="relative pl-8 pb-0 border-l-2 border-gray-200">
                            <div className="absolute left-0 top-0 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">Booking Cancelled</p>
                              <p className="text-sm text-gray-600">{formatDate(selectedBooking.booking_date)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedBooking.status === 'Pending' && (
                  <>
                    <button 
                      type="button" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => updateStatus(selectedBooking.id, 'Confirmed')}
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Confirm Booking
                    </button>
                    <button 
                      type="button" 
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => updateStatus(selectedBooking.id, 'Cancelled')}
                    >
                      <XCircle size={18} className="mr-2" />
                      Cancel Booking
                    </button>
                  </>
                )}
                {selectedBooking.status === 'Confirmed' && (
                  <>
                    <button 
                      type="button" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => sendReminderEmail(selectedBooking)}
                    >
                      <Mail size={18} className="mr-2" />
                      Send Reminder
                    </button>
                    <button 
                      type="button" 
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => updateStatus(selectedBooking.id, 'Cancelled')}
                    >
                      <XCircle size={18} className="mr-2" />
                      Cancel Booking
                    </button>
                  </>
                )}
                {selectedBooking.status === 'Cancelled' && (
                  <button 
                    type="button" 
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => updateStatus(selectedBooking.id, 'Confirmed')}
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Reactivate Booking
                  </button>
                )}
                
                <button 
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => generateInvoice(selectedBooking)}
                >
                  <FileText size={18} className="mr-2" />
                  Generate Invoice
                </button>
                
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;