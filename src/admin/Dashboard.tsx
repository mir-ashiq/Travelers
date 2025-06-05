import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  CalendarCheck, 
  MessageSquare, 
  Eye, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight,
  MapPin,
  Image,
  Download,
  Calendar,
  Bell,
  AlertTriangle,
  FileText,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for real-time updates demonstration
const generateMockData = () => ({
  bookings: Math.floor(Math.random() * 5) + 245,
  revenue: (Math.floor(Math.random() * 10) + 57) + '.2L',
  packages: Math.floor(Math.random() * 3) + 23,
  users: (Math.floor(Math.random() * 2) + 1.1).toFixed(1),
});

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [dashboardData, setDashboardData] = useState(generateMockData());
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('month');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(generateMockData());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Refresh dashboard data
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setDashboardData(generateMockData());
      setLoading(false);
    }, 800);
  };

  const recentBookings = [
    {
      id: 1,
      name: 'Rahul Sharma',
      package: 'Kashmir Bliss: 6 Days Tour',
      date: '2025-06-10',
      amount: 24999,
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Priya Singh',
      package: 'Ladakh Adventure: 8 Days Tour',
      date: '2025-06-15',
      amount: 34999,
      status: 'Confirmed'
    },
    {
      id: 3,
      name: 'Ajay Patel',
      package: 'Gurez Valley Explorer: 5 Days Tour',
      date: '2025-06-12',
      amount: 22999,
      status: 'Pending'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      package: 'Jammu Heritage Tour: 4 Days',
      date: '2025-06-18',
      amount: 18999,
      status: 'Confirmed'
    }
  ];

  const popularPackages = [
    {
      id: 1,
      name: 'Kashmir Bliss: 6 Days Tour',
      bookings: 24,
      revenue: 599976,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Ladakh Adventure: 8 Days Tour',
      bookings: 18,
      revenue: 629982,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Gurez Valley Explorer: 5 Days Tour',
      bookings: 12,
      revenue: 275988,
      trend: 'down'
    },
    {
      id: 4,
      name: 'Jammu Heritage Tour: 4 Days',
      bookings: 15,
      revenue: 284985,
      trend: 'up'
    }
  ];

  // Status card data
  const statusData = [
    { 
      title: 'Total Bookings', 
      value: dashboardData.bookings, 
      trend: 'up', 
      percentage: 12, 
      period: dateRange, 
      icon: CalendarCheck, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Total Revenue', 
      value: `₹${dashboardData.revenue}`, 
      trend: 'up', 
      percentage: 8, 
      period: dateRange, 
      icon: TrendingUp, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Active Packages', 
      value: dashboardData.packages, 
      trend: 'up', 
      percentage: 4, 
      period: dateRange, 
      icon: Package, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Registered Users', 
      value: dashboardData.users, 
      suffix: 'K', 
      trend: 'up', 
      percentage: 18, 
      period: dateRange, 
      icon: Users, 
      color: 'bg-orange-500' 
    },
  ];

  // Booking status donut chart data
  const bookingStatusData = {
    confirmed: 65,
    pending: 25,
    cancelled: 10
  };

  // Example bookings by region bar chart data
  const regionData = {
    'Kashmir': 125,
    'Ladakh': 85,
    'Gurez': 45,
    'Jammu': 68
  };
  
  // System health indicators
  const systemHealth = {
    status: 'Operational',
    uptime: '99.9%',
    lastBackup: '2025-06-01 02:30 AM',
    diskUsage: '42%',
    lastUpdated: new Date().toLocaleString()
  };
  
  // Notification data
  const notifications = [
    { 
      id: 1, 
      title: 'New Booking', 
      message: 'Kashmir Bliss package booked by Rahul Sharma', 
      time: '10 min ago',
      isRead: false,
      type: 'booking'
    },
    { 
      id: 2, 
      title: 'New Testimonial', 
      message: 'New testimonial submitted for approval', 
      time: '1 hour ago',
      isRead: false,
      type: 'testimonial'
    },
    { 
      id: 3, 
      title: 'Support Ticket', 
      message: 'New support request from Priya Patel', 
      time: '3 hours ago',
      isRead: true,
      type: 'support'
    },
    { 
      id: 4, 
      title: 'System Update', 
      message: 'New version available - v1.2.3', 
      time: '1 day ago',
      isRead: true,
      type: 'system'
    },
    { 
      id: 5, 
      title: 'Payment Received', 
      message: 'Payment of ₹34,999 received for booking #1052', 
      time: '2 days ago',
      isRead: true,
      type: 'payment'
    }
  ];
  
  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  // Fake chart component since we don't have a real chart library
  const BarChartMock = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Bookings by Region</h4>
        <div className="text-xs text-gray-500">Last {dateRange === 'month' ? '30' : dateRange === 'week' ? '7' : '365'} days</div>
      </div>
      
      <div className="space-y-4 mt-6">
        {Object.entries(regionData).map(([region, value]) => (
          <div key={region} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span>{region}</span>
              <span className="font-medium">{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary-600 h-2.5 rounded-full" 
                style={{ width: `${(value / 125) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Fake donut chart component
  const DonutChartMock = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Booking Status</h4>
        <div className="text-xs text-gray-500">Current</div>
      </div>
      
      <div className="flex justify-center my-4">
        <div className="relative w-32 h-32">
          {/* This is a simplified donut chart representation */}
          <svg viewBox="0 0 36 36" className="w-full h-full">
            {/* Confirmed - Blue */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray={`${bookingStatusData.confirmed}, 100`}
              strokeLinecap="round"
            />
            {/* Pending - Yellow */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="3"
              strokeDasharray={`${bookingStatusData.pending}, 100`}
              strokeDashoffset={`-${bookingStatusData.confirmed}`}
              strokeLinecap="round"
            />
            {/* Cancelled - Red */}
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#EF4444"
              strokeWidth="3"
              strokeDasharray={`${bookingStatusData.cancelled}, 100`}
              strokeDashoffset={`-${bookingStatusData.confirmed + bookingStatusData.pending}`}
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      
      <div className="flex justify-around text-xs font-medium">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Confirmed ({bookingStatusData.confirmed}%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-1"></div>
          <span>Pending ({bookingStatusData.pending}%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span>Cancelled ({bookingStatusData.cancelled}%)</span>
        </div>
      </div>
    </div>
  );
  
  // Render status card component
  const StatusCard = ({ data }: { data: typeof statusData[0] }) => {
    const Icon = data.icon;
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200 transition-all hover:shadow-md">
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{data.title}</p>
            <h3 className="text-2xl font-bold mt-2">
              {data.value}{data.suffix || ''}
            </h3>
          </div>
          <div className={`${data.color} w-12 h-12 rounded-full flex items-center justify-center text-white`}>
            <Icon size={24} />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {data.trend === 'up' ? (
            <div className="flex items-center text-green-600">
              <ChevronUp size={18} />
              <span className="text-sm font-medium">{data.percentage}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <ChevronDown size={18} />
              <span className="text-sm font-medium">{data.percentage}%</span>
            </div>
          )}
          <span className="text-sm text-gray-500 ml-1">from last {data.period}</span>
        </div>
      </div>
    );
  };
  
  // System Health Card
  const SystemHealthCard = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold flex items-center">
          <Settings size={16} className="mr-2 text-gray-600" />
          System Health
        </h4>
        <div className="flex items-center">
          <span className={`inline-flex h-2 w-2 rounded-full ${
            systemHealth.status === 'Operational' ? 'bg-green-500' : 'bg-red-500'
          } mr-1`}></span>
          <span className="text-xs text-gray-500">{systemHealth.status}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">System Uptime:</span>
          <span className="font-medium">{systemHealth.uptime}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Last Backup:</span>
          <span className="font-medium">{systemHealth.lastBackup}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Disk Usage:</span>
          <span className="font-medium">{systemHealth.diskUsage}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Last Updated:</span>
          <span className="font-medium">{systemHealth.lastUpdated}</span>
        </div>
        <button 
          className="w-full mt-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg py-1 flex items-center justify-center"
          onClick={refreshData}
        >
          <RefreshCw size={14} className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>
    </div>
  );
  
  // Upcoming Tasks Card
  const UpcomingTasksCard = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold flex items-center">
          <Calendar size={16} className="mr-2 text-gray-600" />
          Upcoming Tasks
        </h4>
        <Link to="/admin/tasks" className="text-xs text-primary-600 hover:text-primary-700">
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 bg-yellow-50 border-l-2 border-yellow-500 rounded">
          <div className="flex justify-between">
            <h5 className="font-medium text-sm">Update Summer Packages</h5>
            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">Due Today</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Review and update pricing for summer packages</p>
        </div>
        
        <div className="p-3 bg-blue-50 border-l-2 border-blue-500 rounded">
          <div className="flex justify-between">
            <h5 className="font-medium text-sm">Team Meeting</h5>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Tomorrow</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Weekly review and planning session</p>
        </div>
        
        <div className="p-3 bg-gray-50 border-l-2 border-gray-500 rounded">
          <div className="flex justify-between">
            <h5 className="font-medium text-sm">New Destination Research</h5>
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">Next Week</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Research potential new destinations in Gurez</p>
        </div>
      </div>
    </div>
  );
  
  // Quick Actions Card (Enhanced)
  const QuickActionsCard = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 h-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Quick Actions</h4>
        <div className="flex space-x-1 text-xs">
          <button 
            className={`px-3 py-1 rounded ${dateRange === 'week' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
            onClick={() => setDateRange('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1 rounded ${dateRange === 'month' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
            onClick={() => setDateRange('month')}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1 rounded ${dateRange === 'year' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
            onClick={() => setDateRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Link 
          to="/admin/packages/new" 
          className="flex flex-col items-center justify-center p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition"
        >
          <Package size={32} />
          <span className="mt-2 text-sm font-medium">Add Package</span>
        </Link>
        
        <Link 
          to="/admin/destinations/new" 
          className="flex flex-col items-center justify-center p-4 bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 transition"
        >
          <MapPin size={32} />
          <span className="mt-2 text-sm font-medium">Add Destination</span>
        </Link>
        
        <Link 
          to="/admin/gallery/new" 
          className="flex flex-col items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition"
        >
          <Image size={32} />
          <span className="mt-2 text-sm font-medium">Add to Gallery</span>
        </Link>
        
        <Link 
          to="/admin/users/new" 
          className="flex flex-col items-center justify-center p-4 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition"
        >
          <Users size={32} />
          <span className="mt-2 text-sm font-medium">Add User</span>
        </Link>
      </div>
      
      <div className="mt-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium mb-3 flex items-center">
            <BarChart3 size={18} className="mr-2 text-primary-600" />
            Monthly Reports
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bookings Report</span>
              <button className="flex items-center text-primary-600 hover:underline">
                <Download size={14} className="mr-1" />
                PDF
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue Report</span>
              <button className="flex items-center text-primary-600 hover:underline">
                <Download size={14} className="mr-1" />
                Excel
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Popular Packages</span>
              <button className="flex items-center text-primary-600 hover:underline">
                <Download size={14} className="mr-1" />
                CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Notification dropdown
  const NotificationsDropdown = () => (
    <div className={`absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 ${!showNotifications && 'hidden'}`}>
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex space-x-2">
          <button className="text-xs text-primary-600 hover:underline">
            Mark all as read
          </button>
          <button className="text-xs text-gray-500 hover:underline">
            Settings
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              !notification.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start">
              <div className={`p-2 rounded-full mr-3 ${
                notification.type === 'booking' ? 'bg-blue-100 text-blue-600' :
                notification.type === 'testimonial' ? 'bg-green-100 text-green-600' :
                notification.type === 'support' ? 'bg-orange-100 text-orange-600' :
                notification.type === 'system' ? 'bg-purple-100 text-purple-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {notification.type === 'booking' ? <CalendarCheck size={16} /> :
                 notification.type === 'testimonial' ? <MessageSquare size={16} /> :
                 notification.type === 'support' ? <AlertTriangle size={16} /> :
                 notification.type === 'system' ? <Settings size={16} /> :
                 notification.type === 'payment' ? <FileText size={16} /> : null}
              </div>
              <div>
                <div className="font-medium text-sm">{notification.title}</div>
                <p className="text-sm text-gray-600">
                  {notification.message}
                </p>
                <div className="text-xs mt-1 text-gray-500">
                  {notification.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 text-center">
        <Link to="/admin/notifications" className="text-primary-600 text-sm hover:underline block">
          View all notifications
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, Admin. Here's what's happening with your travel business.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} className="text-gray-500" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
              <span className="text-sm font-medium">Notifications</span>
            </button>
            
            <NotificationsDropdown />
          </div>
          
          <button 
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            onClick={refreshData}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Date Range Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <Calendar size={18} className="text-gray-500 mr-2" />
            <h3 className="text-sm font-medium">Dashboard Overview</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className={`px-4 py-1 text-sm rounded-md ${
                dateRange === 'week' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setDateRange('week')}
            >
              Last 7 Days
            </button>
            <button 
              className={`px-4 py-1 text-sm rounded-md ${
                dateRange === 'month' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setDateRange('month')}
            >
              Last 30 Days
            </button>
            <button 
              className={`px-4 py-1 text-sm rounded-md ${
                dateRange === 'year' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setDateRange('year')}
            >
              Last Year
            </button>
          </div>
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statusData.map((data, index) => (
          <StatusCard key={index} data={data} />
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <BarChartMock />
        </div>
        <div className="lg:col-span-2">
          <DonutChartMock />
        </div>
      </div>
      
      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-lg shadow lg:col-span-4">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Recent Activity</h3>
              <div className="flex space-x-1 text-sm">
                <button 
                  className={`px-3 py-1 rounded ${activeTab === 'recent' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('recent')}
                >
                  Recent Bookings
                </button>
                <button 
                  className={`px-3 py-1 rounded ${activeTab === 'popular' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('popular')}
                >
                  Popular Packages
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-0">
            {activeTab === 'recent' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Client</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Package</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{booking.name}</div>
                          <div className="text-sm text-gray-500">{booking.date}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate">
                          {booking.package}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          ₹{booking.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="p-1 text-primary-600 hover:text-primary-900">
                              <Eye size={18} />
                            </button>
                            {booking.status === 'Pending' && (
                              <>
                                <button className="p-1 text-green-600 hover:text-green-900" title="Confirm">
                                  <CheckCircle size={18} />
                                </button>
                                <button className="p-1 text-red-600 hover:text-red-900" title="Cancel">
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'popular' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Package</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Bookings</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Revenue</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {popularPackages.map(pkg => (
                      <tr key={pkg.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">
                          {pkg.name}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {pkg.bookings}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          ₹{pkg.revenue.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          {pkg.trend === 'up' ? (
                            <ArrowUpRight className="text-green-600\" size={18} />
                          ) : (
                            <ArrowDownRight className="text-red-600\" size={18} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <Link to={activeTab === 'recent' ? "/admin/bookings" : "/admin/packages"} className="text-sm text-primary-600 hover:text-primary-800 font-medium">
              View all {activeTab === 'recent' ? 'bookings' : 'packages'} →
            </Link>
          </div>
        </div>
        
        {/* Right Side Panels */}
        <div className="lg:col-span-3 space-y-6">
          {/* Quick Actions */}
          <QuickActionsCard />
          
          {/* System Health */}
          <SystemHealthCard />
          
          {/* Upcoming Tasks */}
          <UpcomingTasksCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;