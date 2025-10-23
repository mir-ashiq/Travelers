import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Edit2, Trash2, Eye, Plus, Search, Filter, AlertCircle, X, Loader } from 'lucide-react';
import { supabase, Destination } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const DestinationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  // Fetch destinations from the database
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      if (data) {
        setDestinations(data);
        setFilteredDestinations(data);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique regions from destinations
  const regions = [...new Set(destinations.map(dest => dest.region))];

  // Apply filters
  useEffect(() => {
    let results = [...destinations];
    
    if (searchTerm) {
      results = results.filter(dest => 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRegion) {
      results = results.filter(dest => dest.region === selectedRegion);
    }
    
    setFilteredDestinations(results);
  }, [searchTerm, selectedRegion, destinations]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
  };

  // View destination details
  const viewDestinationDetails = (destination: Destination) => {
    setSelectedDestination(destination);
  };

  // Close destination modal
  const closeModal = () => {
    setSelectedDestination(null);
  };

  // Delete destination
  const deleteDestination = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        const { error } = await supabase
          .from('destinations')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Remove from local state
        setDestinations(destinations.filter(dest => dest.id !== id));
        toast.success('Destination deleted successfully');
      } catch (error) {
        console.error('Error deleting destination:', error);
        toast.error('Failed to delete destination');
      }
    }
  };

  // Toggle featured status
  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('destinations')
        .update({ featured: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setDestinations(destinations.map(dest => {
        if (dest.id === id) {
          return {...dest, featured: !currentStatus};
        }
        return dest;
      }));
      
      toast.success(`Destination ${!currentStatus ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      console.error('Error updating destination:', error);
      toast.error('Failed to update destination');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Destinations</h1>
          <p className="text-gray-600">Create, edit, and manage your travel destinations</p>
        </div>
        <Link 
          to="/admin/destinations/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New Destination
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="md:w-64 relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Regions</option>
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
          
          {(searchTerm || selectedRegion) && (
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
      
      {/* Destinations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader size={40} className="animate-spin text-primary-600 mr-3" />
              <span className="text-lg">Loading destinations...</span>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
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
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map(destination => (
                    <tr key={destination.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={destination.image} 
                            alt={destination.name} 
                            className="w-10 h-10 rounded object-cover mr-3"
                            onError={(e) => (e.currentTarget.src = "https://placehold.co/40")}
                          />
                          <span className="font-medium text-gray-900">{destination.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <MapPin size={12} className="mr-1" />
                          {destination.region}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {destination.description}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleFeatured(destination.id, destination.featured)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            destination.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {destination.featured ? 'Featured' : 'Not Featured'}
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button 
                          className="text-primary-600 hover:text-primary-900"
                          onClick={() => viewDestinationDetails(destination)}
                        >
                          <Eye size={18} />
                        </button>
                        <Link 
                          to={`/admin/destinations/edit/${destination.id}`} 
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => deleteDestination(destination.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertCircle size={40} className="text-gray-400 mb-2" />
                        <h3 className="text-lg font-medium text-gray-900">No destinations found</h3>
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
        {!loading && filteredDestinations.length > 0 && (
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredDestinations.length}</span> of{' '}
                  <span className="font-medium">{filteredDestinations.length}</span> results
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
      
      {/* Destination Details Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Destination Details
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
                        src={selectedDestination.image}
                        alt={selectedDestination.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/400x200")}
                      />
                      <h2 className="text-xl font-bold mb-2">{selectedDestination.name}</h2>
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
                        <MapPin size={12} className="mr-1" />
                        {selectedDestination.region}
                      </div>
                      <p className="text-gray-600 mb-4">{selectedDestination.description}</p>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Featured:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedDestination.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedDestination.featured ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link
                  to={`/admin/destinations/edit/${selectedDestination.id}`}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => toggleFeatured(selectedDestination.id, selectedDestination.featured)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {selectedDestination.featured ? 'Unfeature' : 'Feature'}
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

export default DestinationsPage;