import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  LineChart, 
  PieChart,
  RefreshCw,
  Filter,
  FileText,
  ChevronDown 
} from 'lucide-react';

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [activeReportType, setActiveReportType] = useState('bookings');

  // Refresh data function
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-600">Analyze your business performance and generate reports</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center"
              onClick={() => {}}
            >
              <Download size={18} className="mr-2" />
              Export Report
              <ChevronDown size={16} className="ml-2" />
            </button>
          </div>
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
            onClick={refreshData}
          >
            <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      
      {/* Date Range Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center">
            <Calendar size={18} className="text-gray-500 mr-2" />
            <h3 className="text-sm font-medium">Report Period</h3>
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
            <button 
              className={`px-4 py-1 text-sm rounded-md ${
                dateRange === 'custom' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setDateRange('custom')}
            >
              Custom Range
            </button>
          </div>
        </div>
      </div>
      
      {/* Report Types */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveReportType('bookings')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeReportType === 'bookings'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Booking Reports
            </button>
            <button
              onClick={() => setActiveReportType('revenue')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeReportType === 'revenue'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Revenue Reports
            </button>
            <button
              onClick={() => setActiveReportType('packages')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeReportType === 'packages'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Package Performance
            </button>
            <button
              onClick={() => setActiveReportType('destinations')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeReportType === 'destinations'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Destination Popularity
            </button>
          </nav>
        </div>
        
        {/* Report Content */}
        <div className="p-6">
          {/* Bookings Report */}
          {activeReportType === 'bookings' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                      <p className="text-2xl font-bold mt-2">248</p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <FileText size={24} />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-green-600 text-sm flex items-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 10.25L12 4.75L6.75 10.25"/>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19.25V5.75"/>
                      </svg>
                      12%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last {dateRange}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                      <p className="text-2xl font-bold mt-2">24.5%</p>
                    </div>
                    <div className="bg-green-100 text-green-600 p-2 rounded-full">
                      <TrendingUp size={24} />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-green-600 text-sm flex items-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 10.25L12 4.75L6.75 10.25"/>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19.25V5.75"/>
                      </svg>
                      3.2%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last {dateRange}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cancellation Rate</p>
                      <p className="text-2xl font-bold mt-2">5.2%</p>
                    </div>
                    <div className="bg-red-100 text-red-600 p-2 rounded-full">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 13.75L12 19.25L6.75 13.75"/>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.75V18.25"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-red-600 text-sm flex items-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 13.75L12 19.25L6.75 13.75"/>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.75V18.25"/>
                      </svg>
                      1.3%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last {dateRange}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Bookings Over Time</h3>
                    <p className="text-gray-500 text-sm">Showing booking trends over the selected period</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-sm text-primary-600 flex items-center">
                      <Download size={16} className="mr-1" />
                      Export
                    </button>
                    <div className="relative">
                      <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        className="appearance-none bg-white pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      >
                        <option>All Packages</option>
                        <option>Kashmir Bliss</option>
                        <option>Ladakh Adventure</option>
                        <option>Gurez Valley Explorer</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Chart Placeholder */}
                <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart size={64} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Booking trend chart will be displayed here</p>
                    <p className="text-sm text-gray-400">Data visualization for booking trends over time</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Bookings by Package</h3>
                  
                  {/* Chart Placeholder */}
                  <div className="h-60 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <PieChart size={48} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">Package distribution chart</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span>Kashmir Bliss (42%)</span>
                      </div>
                      <span className="font-medium">104 bookings</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Ladakh Adventure (28%)</span>
                      </div>
                      <span className="font-medium">68 bookings</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Gurez Valley (15%)</span>
                      </div>
                      <span className="font-medium">38 bookings</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span>Jammu Heritage (15%)</span>
                      </div>
                      <span className="font-medium">38 bookings</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Bookings by Source</h3>
                  
                  {/* Chart Placeholder */}
                  <div className="h-60 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <BarChart3 size={48} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">Booking sources chart</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span>Website (60%)</span>
                      </div>
                      <span className="font-medium">149 bookings</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Mobile App (20%)</span>
                      </div>
                      <span className="font-medium">50 bookings</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Phone Inquiry (12%)</span>
                      </div>
                      <span className="font-medium">29 bookings</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span>Partner Agencies (8%)</span>
                      </div>
                      <span className="font-medium">20 bookings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Revenue Report */}
          {activeReportType === 'revenue' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold mt-2">₹62.8L</p>
                    </div>
                    <div className="bg-green-100 text-green-600 p-2 rounded-full">
                      <TrendingUp size={24} />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-green-600 text-sm flex items-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 10.25L12 4.75L6.75 10.25"/>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19.25V5.75"/>
                      </svg>
                      8.3%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last {dateRange}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Average Booking Value</p>
                      <p className="text-2xl font-bold mt-2">₹25,310</p>
                    </div>
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <BarChart3 size={24} />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-green-600 text-sm flex items-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 10.25L12 4.75L6.75 10.25"/>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 19.25V5.75"/>
                      </svg>
                      2.1%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last {dateRange}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Refund Amount</p>
                      <p className="text-2xl font-bold mt-2">₹1.2L</p>
                    </div>
                    <div className="bg-red-100 text-red-600 p-2 rounded-full">
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 13.75L12 19.25L6.75 13.75"/>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.75V18.25"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <span className="text-red-600 text-sm flex items-center">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.25 13.75L12 19.25L6.75 13.75"/>
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.75V18.25"/>
                      </svg>
                      0.8%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last {dateRange}</span>
                  </div>
                </div>
              </div>
              
              {/* Revenue Chart */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Revenue Trend</h3>
                    <p className="text-gray-500 text-sm">Monthly revenue for the selected period</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-sm text-primary-600 flex items-center">
                      <Download size={16} className="mr-1" />
                      Export
                    </button>
                  </div>
                </div>
                
                {/* Chart Placeholder */}
                <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 size={64} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">Revenue chart will be displayed here</p>
                    <p className="text-sm text-gray-400">Data visualization for revenue trends over time</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Revenue by Package</h3>
                  
                  {/* Top Revenue Generating Packages */}
                  <div className="space-y-4 mt-3">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <div>
                          <span className="font-medium">Ladakh Adventure: 8 Days Tour</span>
                        </div>
                        <span>₹17.9L</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <div>
                          <span className="font-medium">Kashmir Bliss: 6 Days Tour</span>
                        </div>
                        <span>₹16.5L</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <div>
                          <span className="font-medium">Gurez Valley Explorer: 5 Days</span>
                        </div>
                        <span>₹8.7L</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "48%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <div>
                          <span className="font-medium">Jammu Heritage Tour: 4 Days</span>
                        </div>
                        <span>₹7.1L</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "40%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                  
                  {/* Chart Placeholder */}
                  <div className="h-60 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <PieChart size={48} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-500">Payment methods distribution</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span>Credit/Debit Card (45%)</span>
                      </div>
                      <span className="font-medium">₹28.3L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>UPI (30%)</span>
                      </div>
                      <span className="font-medium">₹18.9L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span>Net Banking (15%)</span>
                      </div>
                      <span className="font-medium">₹9.4L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span>Wallet (10%)</span>
                      </div>
                      <span className="font-medium">₹6.3L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Package Performance Report */}
          {activeReportType === 'packages' && (
            <div>
              <p className="text-gray-500 text-center py-8">Package Performance Report content will be displayed here.</p>
            </div>
          )}
          
          {/* Destination Popularity Report */}
          {activeReportType === 'destinations' && (
            <div>
              <p className="text-gray-500 text-center py-8">Destination Popularity Report content will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;