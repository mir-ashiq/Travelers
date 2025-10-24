import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Package, 
  CalendarCheck, 
  MessageSquare, 
  Image, 
  Users, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Sun,
  Moon,
  Bell,
  Search,
  FileText,
  BarChart2,
  AlertTriangle,
  UserCheck,
  Upload,
  LifeBuoy,
  Lightbulb,
  Heart
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('adminDarkMode') === 'true');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('adminDarkMode', darkMode.toString());
  }, [darkMode]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Destinations', path: '/admin/destinations', icon: MapPin },
    { name: 'Packages', path: '/admin/packages', icon: Package },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Gallery', path: '/admin/gallery', icon: Image },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Reports', path: '/admin/reports', icon: BarChart2 },
    { name: 'Support', path: '/admin/support', icon: LifeBuoy },
    { name: 'FAQ', path: '/admin/faq', icon: HelpCircle },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const notifications = [
    { id: 1, title: 'New Booking', message: 'Kashmir Bliss package booked by Rahul Sharma', time: '10 min ago' },
    { id: 2, title: 'New Testimonial', message: 'New testimonial submitted for approval', time: '1 hour ago' },
    { id: 3, title: 'Support Ticket', message: 'New support request from Priya Patel', time: '3 hours ago' },
    { id: 4, title: 'System Update', message: 'New version available - v1.2.3', time: '1 day ago' },
    { id: 5, title: 'Payment Received', message: 'Payment of ₹34,999 received for booking #1052', time: '2 days ago' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };
  
  const handleLogout = () => {
    // Clear auth from localStorage
    localStorage.removeItem('adminAuth');
    // Redirect to login page
    navigate('/admin/login');
  };
  
  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Escape to close search
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Sidebar for desktop */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-md lg:block`}>
        <div className="h-full flex flex-col">
          <div className={`h-20 flex items-center justify-between px-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <Link to="/admin" className="flex items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${darkMode ? 'bg-primary-600' : 'bg-primary-100 text-primary-600'}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12h20"/>
                  <path d="M12 2a10 10 0 1 0 10 10"/>
                  <path d="M12 2v10l4-4"/>
                  <path d="M12 2v10l-4-4"/>
                  <path d="M8.5 7a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z"/>
                </svg>
              </div>
              <span className="ml-2 font-heading font-bold text-xl">JKLG Admin</span>
            </Link>
            <button 
              className="lg:hidden"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X className={`${darkMode ? 'text-white' : 'text-gray-600'}`} size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pt-6 px-4 pb-6">
            <ul className="space-y-1">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path) 
                          ? 'bg-primary-600 text-white' 
                          : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                      }`}
                    >
                      <Icon size={20} className="mr-3 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            
            {/* Sidebar footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 mb-4">
                <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center">
                    <Heart size={18} className="text-pink-500 mr-2" />
                    <span className="text-sm">Need help?</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                    Check our documentation or contact support
                  </p>
                  <button className="w-full mt-2 text-xs px-3 py-1 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                    View Documentation
                  </button>
                </div>
              </div>
              
              <div className="px-4">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div>
                    <div>System Status</div>
                    <div className="flex items-center">
                      <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                      <span className="text-xs">All services operational</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs">v1.2.3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 mt-auto border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              onClick={handleLogout}
              className={`flex w-full items-center px-4 py-2 rounded-lg ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <LogOut size={20} className="mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={`lg:ml-64 min-h-screen flex flex-col`}>
        {/* Top navbar */}
        <header className={`h-20 flex items-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b px-6`}>
          <button 
            className="lg:hidden mr-4"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <Menu className={`${darkMode ? 'text-white' : 'text-gray-600'}`} size={24} />
          </button>
          
          {/* Search button (mobile) */}
          <button 
            className="md:hidden mr-3"
            onClick={() => setSearchOpen(true)}
          >
            <Search className={`${darkMode ? 'text-white' : 'text-gray-600'}`} size={20} />
          </button>
          
          {/* Search bar (desktop) */}
          <div className="hidden md:flex items-center relative flex-grow max-w-md mr-4">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className={`w-full pl-10 pr-4 py-2 rounded-md ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200'
                } border focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-400">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center ml-auto space-x-4">
            {/* Dark mode toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Notifications dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'} relative`}
                aria-label="View notifications"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>
              
              {notificationsOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } ring-1 ring-black ring-opacity-5 z-50`}>
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Notifications</h3>
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {notifications.length} new
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                      >
                        <div className="font-medium text-sm">{notification.title}</div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                        <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {notification.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Link to="/admin/notifications" className="text-primary-600 text-sm hover:underline block text-center">
                      See all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User dropdown */}
            <div className="relative inline-block text-left">
              <button 
                className="flex items-center space-x-2 focus:outline-none" 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
              >
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32"
                  alt="Admin user" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary-600"
                />
                <span className={darkMode ? 'text-white' : 'text-gray-700'}>Admin User</span>
                <ChevronDown size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
              
              {userMenuOpen && (
                <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}>
                  <div className="py-1">
                    <Link 
                      to="/admin/profile" 
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      to="/admin/settings" 
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Global Search Modal */}
        {searchOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-25 z-50 flex items-start justify-center pt-24">
            <div className={`w-full max-w-2xl mx-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
              <div className="p-4">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search for packages, bookings, users..."
                    className={`w-full pl-10 pr-4 py-3 rounded-lg ${
                      darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className={`mt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
                  <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
                  <div className="space-y-2">
                    <div className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}>
                      <div className="flex items-center">
                        <Package size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm">Kashmir Bliss Package</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}>
                      <div className="flex items-center">
                        <Users size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm">Rahul Sharma (Customer)</span>
                      </div>
                    </div>
                    <div className={`p-2 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer`}>
                      <div className="flex items-center">
                        <MapPin size={16} className="text-gray-400 mr-2" />
                        <span className="text-sm">Destinations in Ladakh</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3">
                  <div className="flex items-center text-xs text-gray-500 justify-between">
                    <div>Press ESC to close</div>
                    <div>Search results will appear here</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Onboarding Tips - can be shown to new admins */}
        <div className={`fixed bottom-4 right-4 z-40 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs ${false ? 'block' : 'hidden'}`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-full mr-2">
                <Lightbulb size={16} />
              </div>
              <h4 className="font-medium">Quick Tip</h4>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Use keyboard shortcut <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-800 font-mono text-xs">Ctrl+K</kbd> to quickly search across your admin panel.
          </p>
          <div className="flex justify-between items-center">
            <button className="text-xs text-primary-600 hover:underline">
              Next tip
            </button>
            <button className="text-xs text-gray-500 hover:underline">
              Don't show again
            </button>
          </div>
        </div>
        
        {/* Page content */}
        <main className="flex-grow p-6">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className={`py-4 px-6 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} JKLG Travel Agency Admin Panel
            </p>
            <div className="mt-2 md:mt-0 flex items-center space-x-4">
              <Link to="/admin/help" className="text-sm hover:text-primary-600 transition-colors">
                Help Center
              </Link>
              <Link to="/admin/terms" className="text-sm hover:text-primary-600 transition-colors">
                Terms of Use
              </Link>
              <Link to="/admin/privacy" className="text-sm hover:text-primary-600 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;