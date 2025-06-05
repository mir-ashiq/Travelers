import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit2, 
  Trash2, 
  Eye, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Tag, 
  AlertCircle,
  X,
  ChevronDown
} from 'lucide-react';

// Mock blog post data
const mockPosts = [
  {
    id: 1,
    title: 'Top 10 Must-Visit Places in Kashmir Valley',
    excerpt: 'Discover the breathtaking beauty of Kashmir with our guide to the top 10 destinations that should be on every traveler\'s bucket list.',
    featuredImage: 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=300',
    author: 'Priya Kaul',
    date: '2025-05-15',
    category: 'Destinations',
    tags: ['Kashmir', 'Travel Guide', 'Sightseeing'],
    status: 'Published',
    views: 2456
  },
  {
    id: 2,
    title: 'A Beginner\'s Guide to Trekking in Ladakh',
    excerpt: 'Planning your first trek to Ladakh? Here\'s everything you need to know about preparation, altitude sickness, best routes, and more.',
    featuredImage: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=300',
    author: 'Raj Gupta',
    date: '2025-05-08',
    category: 'Adventure',
    tags: ['Ladakh', 'Trekking', 'Adventure Sports'],
    status: 'Published',
    views: 1832
  },
  {
    id: 3,
    title: 'Cultural Heritage of Jammu: Beyond the Temples',
    excerpt: 'Explore the rich cultural heritage of Jammu region, from ancient forts to traditional crafts and cuisine.',
    featuredImage: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=300',
    author: 'Aarav Sharma',
    date: '2025-04-27',
    category: 'Culture',
    tags: ['Jammu', 'Cultural Heritage', 'History'],
    status: 'Published',
    views: 1245
  },
  {
    id: 4,
    title: 'The Hidden Gem of Kashmir: Exploring Gurez Valley',
    excerpt: 'Journey with us as we take you through the untouched beauty of Gurez Valley, one of Kashmir\'s best-kept secrets.',
    featuredImage: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=300',
    author: 'Zara Khan',
    date: '2025-04-20',
    category: 'Off the Beaten Path',
    tags: ['Gurez', 'Hidden Gems', 'Kashmir'],
    status: 'Published',
    views: 983
  },
  {
    id: 5,
    title: 'Sustainable Tourism in Kashmir: How to Travel Responsibly',
    excerpt: 'Learn how to minimize your environmental impact while traveling in Kashmir and contribute positively to local communities.',
    featuredImage: 'https://images.pexels.com/photos/7680353/pexels-photo-7680353.jpeg?auto=compress&cs=tinysrgb&w=300',
    author: 'Priya Kaul',
    date: '2025-05-30',
    category: 'Sustainable Travel',
    tags: ['Eco-friendly', 'Sustainable Tourism', 'Responsible Travel'],
    status: 'Draft',
    views: 0
  }
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(mockPosts);
  
  // Extract unique categories
  const categories = [...new Set(mockPosts.map(post => post.category))];

  // Apply filters
  React.useEffect(() => {
    let results = [...mockPosts];
    
    if (searchTerm) {
      results = results.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (categoryFilter) {
      results = results.filter(post => post.category === categoryFilter);
    }
    
    if (statusFilter) {
      results = results.filter(post => post.status === statusFilter);
    }
    
    setFilteredPosts(results);
  }, [searchTerm, categoryFilter, statusFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Blog</h1>
          <p className="text-gray-600">Create, edit, and publish blog posts</p>
        </div>
        <Link 
          to="/admin/blog/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Write New Post
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="md:w-52 relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          
          <div className="md:w-52 relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
          
          {(searchTerm || categoryFilter || statusFilter) && (
            <button
              onClick={clearFilters}
              className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              <X size={16} className="mr-2" />
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Blog Posts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Post
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <img 
                          src={post.featuredImage} 
                          alt={post.title} 
                          className="w-12 h-12 rounded object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{post.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User size={14} className="text-gray-400 mr-1" />
                        <span className="text-sm">{post.author}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(post.date)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <Eye size={14} className="text-gray-400 mr-1" />
                        {post.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <Eye size={18} />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        <Edit2 size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No blog posts found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPosts.length}</span> of{' '}
                <span className="font-medium">{filteredPosts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
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
    </div>
  );
};

export default BlogPage;