import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye, Plus, Search, Filter, Clock, MapPin, Star, AlertCircle, X, Loader } from 'lucide-react';
import { TourPackage } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const PackagesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [filteredPackages, setFilteredPackages] = useState<TourPackage[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);

  // Fetch packages from the backend API
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3000/api/packages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          toast.error('You do not have permission to view packages');
        } else {
          throw new Error(`Failed to fetch packages: ${response.statusText}`);
        }
        return;
      }
      
      const data = await response.json();
      setPackages(data);
      setFilteredPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  // Extract all unique regions from packages destinations
  const regions = [...new Set(packages.flatMap(pkg => pkg.destinations))].sort();

  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under ₹20,000', value: '0-20000' },
    { label: '₹20,000 - ₹30,000', value: '20000-30000' },
    { label: 'Above ₹30,000', value: '30000-9999999' }
  ];

  // Apply filters
  useEffect(() => {
    let results = [...packages];
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destinations.some(dest => dest.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by region
    if (selectedRegion) {
      results = results.filter(pkg => pkg.destinations.includes(selectedRegion));
    }
    
    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      results = results.filter(pkg => pkg.price >= min && pkg.price <= max);
    }
    
    setFilteredPackages(results);
  }, [searchTerm, selectedRegion, priceRange, packages]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setPriceRange('');
  };

  // View package details
  const viewPackageDetails = (pkg: TourPackage) => {
    setSelectedPackage(pkg);
  };

  // Close package modal
  const closeModal = () => {
    setSelectedPackage(null);
  };

  // Delete package
  const deletePackage = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:3000/api/packages/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 403) {
            toast.error('You do not have permission to delete packages');
          } else {
            throw new Error(`Failed to delete package: ${response.statusText}`);
          }
          return;
        }
        
        // Remove from local state
        setPackages(packages.filter(pkg => pkg.id !== id));
        toast.success('Package deleted successfully');
      } catch (error) {
        console.error('Error deleting package:', error);
        toast.error('Failed to delete package');
      }
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`http://localhost:3000/api/packages/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !currentStatus }),
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          toast.error('You do not have permission to edit packages');
        } else {
          throw new Error(`Failed to update package: ${response.statusText}`);
        }
        return;
      }
      
      // Update local state
      setPackages(packages.map(pkg => {
        if (pkg.id === id) {
          return {...pkg, featured: !currentStatus};
        }
        return pkg;
      }));
      
      toast.success(`Package ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error('Failed to update package');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Tour Packages</h1>
          <p className="text-gray-600">Create, edit, and manage your tour packages</p>
        </div>
        <Link 
          to="/admin/packages/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New Package
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="md:w-52 relative">
            <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Destinations</option>
              {regions.map((region, index) => (
                <option key={index} value={region}>{region}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="md:w-52 relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {priceRanges.map((range, index) => (
                <option key={index} value={range.value}>{range.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {(searchTerm || selectedRegion || priceRange) && (
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
      
      {/* Packages Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader size={40} className="animate-spin text-primary-600 mr-3" />
              <span className="text-lg">Loading packages...</span>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destinations
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.length > 0 ? (
                  filteredPackages.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={pkg.image} 
                            alt={pkg.title} 
                            className="w-10 h-10 rounded object-cover mr-3"
                            onError={(e) => (e.currentTarget.src = "https://placehold.co/40")}
                          />
                          <div className="max-w-xs truncate">{pkg.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {pkg.duration} Days
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {pkg.destinations.map((dest, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {dest}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star size={14} className="text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-900">{pkg.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeatured(pkg.id, pkg.featured)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pkg.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {pkg.featured ? 'Featured' : 'Not Featured'}
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button 
                          className="text-primary-600 hover:text-primary-900"
                          onClick={() => viewPackageDetails(pkg)}
                        >
                          <Eye size={18} />
                        </button>
                        <Link 
                          to={`/admin/packages/edit/${pkg.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => deletePackage(pkg.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle size={40} className="text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No packages found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!loading && filteredPackages.length > 0 && (
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPackages.length}</span> of{' '}
                  <span className="font-medium">{filteredPackages.length}</span> results
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
        )}
      </div>
      
      {/* Package Details Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Package Details
                      </h3>
                      <button 
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    <div className="mb-6">
                      <img
                        src={selectedPackage.image}
                        alt={selectedPackage.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/800x400")}
                      />
                      <h2 className="text-xl font-bold mb-2">{selectedPackage.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedPackage.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium">₹{selectedPackage.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">{selectedPackage.duration} Days</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Destinations</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedPackage.destinations.map((dest, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {dest}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Included</p>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {selectedPackage.included.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Excluded</p>
                        <ul className="list-disc list-inside text-sm text-gray-700">
                          {selectedPackage.excluded.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link
                  to={`/admin/packages/edit/${selectedPackage.id}`}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleFeatured(selectedPackage.id, selectedPackage.featured)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {selectedPackage.featured ? 'Unfeature' : 'Feature'}
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

export default PackagesPage;