import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Package,
  CalendarCheck,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Settings,
  RefreshCw,
  Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [dashboardData, setDashboardData] = useState({
    bookings: 0,
    revenue: 0,
    packages: 0,
    users: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [popularPackages, setPopularPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get booking count
      const { count: bookingCount, error: bookingErr } = await supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true });

      if (bookingErr) console.error('Booking count error:', bookingErr);

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('bookings')
        .select('amount');
      const totalRevenue = revenueData?.reduce((sum: number, b: any) => sum + (b.amount || 0), 0) || 0;

      // Get package count
      const { count: packageCount, error: pkgErr } = await supabase
        .from('packages')
        .select('id', { count: 'exact', head: true });

      if (pkgErr) console.error('Package count error:', pkgErr);

      // Get active users count
      const { count: userCount, error: userErr } = await supabase
        .from('admin_users')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Active');

      if (userErr) console.error('User count error:', userErr);

      // Get recent bookings - using correct column names: name, package, amount, status, created_at
      const { data: bookings, error: bookingsErr } = await supabase
        .from('bookings')
        .select('id,name,package,amount,status,created_at')
        .order('created_at', { ascending: false })
        .limit(4);

      if (bookingsErr) console.error('Bookings error:', bookingsErr);

      // No need to fetch package names since booking.package is already the package name/title
      const bookingsWithPackages = (bookings || []).map((booking: any) => ({
        id: booking.id,
        name: booking.name,
        package: booking.package || 'Unknown Package',
        date: new Date(booking.created_at).toLocaleDateString(),
        amount: booking.amount,
        status: booking.status
      }));

      // Get popular packages - count bookings in JavaScript since there's no bookings_count column
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('package,amount');

      const { data: packages, error: packagesErr } = await supabase
        .from('packages')
        .select('id,title,price');

      if (packagesErr) console.error('Packages error:', packagesErr);

      // Calculate booking counts and revenue per package
      const bookingCounts: Record<string, number> = {};
      const packageRevenue: Record<string, number> = {};
      
      (allBookings || []).forEach((booking: any) => {
        bookingCounts[booking.package] = (bookingCounts[booking.package] || 0) + 1;
        packageRevenue[booking.package] = (packageRevenue[booking.package] || 0) + (booking.amount || 0);
      });

      const packagesWithStats = (packages || [])
        .map((pkg: any) => ({
          id: pkg.id,
          name: pkg.title,
          bookings: bookingCounts[pkg.title] || 0,
          revenue: packageRevenue[pkg.title] || 0,
          trend: Math.random() > 0.5 ? 'up' : 'down'
        }))
        .sort((a: any, b: any) => b.bookings - a.bookings)
        .slice(0, 4);

      setDashboardData({
        bookings: bookingCount || 0,
        revenue: totalRevenue,
        packages: packageCount || 0,
        users: userCount || 0,
      });
      setRecentBookings(bookingsWithPackages);
      setPopularPackages(packagesWithStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const bookingStatusData = { confirmed: 65, pending: 25, cancelled: 10 };
  const regionData = { 'Kashmir': 125, 'Ladakh': 85, 'Gurez': 45, 'Jammu': 68 };
  const systemHealth = {
    status: 'Operational',
    uptime: '99.9%',
    lastBackup: new Date().toLocaleString(),
    diskUsage: '42%',
    lastUpdated: new Date().toLocaleString()
  };

  const BarChartMock = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 h-full">
      <h4 className="font-semibold mb-4">Bookings by Region</h4>
      <div className="space-y-4">
        {Object.entries(regionData).map(([region, value]) => (
          <div key={region}>
            <div className="flex justify-between text-sm mb-1">
              <span>{region}</span>
              <span className="font-medium">{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${(value / 125) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DonutChartMock = () => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 h-full">
      <h4 className="font-semibold mb-4">Booking Status</h4>
      <div className="flex justify-center my-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray={`${bookingStatusData.confirmed}, 100`} strokeLinecap="round" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FBBF24" strokeWidth="3" strokeDasharray={`${bookingStatusData.pending}, 100`} strokeDashoffset={`-${bookingStatusData.confirmed}`} strokeLinecap="round" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray={`${bookingStatusData.cancelled}, 100`} strokeDashoffset={`-${bookingStatusData.confirmed + bookingStatusData.pending}`} strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <div className="flex justify-around text-xs">
        <div className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>Conf</div>
        <div className="flex items-center"><div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>Pend</div>
        <div className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>Cancel</div>
      </div>
    </div>
  );

  const statusData = [
    { title: 'Total Bookings', value: dashboardData.bookings, icon: CalendarCheck, color: 'bg-blue-500' },
    { title: 'Total Revenue', value: `₹${(dashboardData.revenue / 100000).toFixed(2)}L`, icon: TrendingUp, color: 'bg-green-500' },
    { title: 'Active Packages', value: dashboardData.packages, icon: Package, color: 'bg-purple-500' },
    { title: 'Registered Users', value: `${(dashboardData.users / 1000).toFixed(1)}K`, icon: Users, color: 'bg-orange-500' },
  ];

  const StatusCard = ({ data }: any) => {
    const Icon = data.icon;
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-600">{data.title}</p>
            <h3 className="text-2xl font-bold mt-2">{data.value}</h3>
          </div>
          <div className={`${data.color} w-12 h-12 rounded-full flex items-center justify-center text-white`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Real-time business metrics</p>
        </div>
        <button onClick={fetchDashboardData} disabled={loading} className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50">
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statusData.map((data, i) => <StatusCard key={i} data={data} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3"><BarChartMock /></div>
        <div className="lg:col-span-2"><DonutChartMock /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg lg:col-span-4">
          <div className="p-4 border-b">
            <div className="flex justify-between">
              <h3 className="font-semibold">Recent Activity</h3>
              <div className="flex gap-1">
                <button onClick={() => setActiveTab('recent')} className={`px-3 py-1 rounded text-sm ${activeTab === 'recent' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}>Bookings</button>
                <button onClick={() => setActiveTab('popular')} className={`px-3 py-1 rounded text-sm ${activeTab === 'popular' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}`}>Packages</button>
              </div>
            </div>
          </div>
          <div className="p-0">
            {loading ? (
              <div className="flex justify-center p-8"><Loader className="animate-spin" size={24} /></div>
            ) : activeTab === 'recent' && recentBookings.length > 0 ? (
              <table className="w-full">
                <thead><tr className="bg-gray-50"><th className="px-4 py-3 text-sm font-medium text-left">Client</th><th className="px-4 py-3 text-sm font-medium text-left">Package</th><th className="px-4 py-3 text-sm font-medium text-left">Amount</th><th className="px-4 py-3 text-sm font-medium text-left">Status</th></tr></thead>
                <tbody className="divide-y">
                  {recentBookings.map(b => <tr key={b.id} className="hover:bg-gray-50"><td className="px-4 py-3">{b.name}</td><td className="px-4 py-3 text-sm">{b.package}</td><td className="px-4 py-3">₹{b.amount.toLocaleString()}</td><td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{b.status}</span></td></tr>)}</tbody>
              </table>
            ) : activeTab === 'popular' && popularPackages.length > 0 ? (
              <table className="w-full">
                <thead><tr className="bg-gray-50"><th className="px-4 py-3 text-sm font-medium text-left">Package</th><th className="px-4 py-3 text-sm font-medium text-left">Bookings</th><th className="px-4 py-3 text-sm font-medium text-left">Revenue</th><th className="px-4 py-3 text-sm font-medium text-left">Trend</th></tr></thead>
                <tbody className="divide-y">
                  {popularPackages.map(p => <tr key={p.id} className="hover:bg-gray-50"><td className="px-4 py-3">{p.name}</td><td className="px-4 py-3">{p.bookings}</td><td className="px-4 py-3">₹{p.revenue.toLocaleString()}</td><td className="px-4 py-3">{p.trend === 'up' ? <ArrowUpRight className="text-green-600" size={18} /> : <ArrowDownRight className="text-red-600" size={18} />}</td></tr>)}</tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">No data available</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/admin/packages/new" className="flex flex-col items-center p-3 bg-primary-50 text-primary-700 rounded hover:bg-primary-100">
                <Package size={24} />
                <span className="text-xs font-medium mt-1">Add Package</span>
              </Link>
              <Link to="/admin/destinations/new" className="flex flex-col items-center p-3 bg-secondary-50 text-secondary-700 rounded hover:bg-secondary-100">
                <MapPin size={24} />
                <span className="text-xs font-medium mt-1">Add Destination</span>
              </Link>
              <Link to="/admin/users/new" className="flex flex-col items-center p-3 bg-orange-50 text-orange-700 rounded hover:bg-orange-100">
                <Users size={24} />
                <span className="text-xs font-medium mt-1">Add User</span>
              </Link>
              <Link to="/admin/testimonials/new" className="flex flex-col items-center p-3 bg-purple-50 text-purple-700 rounded hover:bg-purple-100">
                <MessageSquare size={24} />
                <span className="text-xs font-medium mt-1">Testimonial</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold flex items-center mb-4"><Settings size={16} className="mr-2" />System Health</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Status:</span><span className="text-green-600 font-medium">Operational</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Uptime:</span><span>{systemHealth.uptime}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Disk Usage:</span><span>{systemHealth.diskUsage}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
