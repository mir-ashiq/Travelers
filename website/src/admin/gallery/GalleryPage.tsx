import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Eye, Plus, Search, Filter, X, AlertCircle, Loader } from 'lucide-react';
import { GalleryItem } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const GalleryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch gallery from the backend API
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3000/api/gallery', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          toast.error('You do not have permission to view gallery');
        } else {
          throw new Error(`Failed to fetch gallery: ${response.statusText}`);
        }
        return;
      }
      
      const data = await response.json();
      setGallery(data);
      setFilteredGallery(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique locations from gallery items
  const locations = [...new Set(gallery.map(item => item.location))];

  // Apply filters
  useEffect(() => {
    let results = [...gallery];
    
    if (searchTerm) {
      results = results.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLocation) {
      results = results.filter(item => item.location === selectedLocation);
    }
    
    setFilteredGallery(results);
  }, [searchTerm, selectedLocation, gallery]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
  };

  // Delete gallery item
  const deleteGalleryItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:3000/api/gallery/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          if (response.status === 403) {
            toast.error('You do not have permission to delete gallery items');
          } else {
            throw new Error(`Failed to delete image: ${response.statusText}`);
          }
          return;
        }
        
        setGallery(gallery.filter(item => item.id !== id));
        toast.success('Image deleted successfully');
      } catch (error) {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Gallery</h1>
          <p className="text-gray-600">Upload and manage your gallery images</p>
        </div>
        <Link 
          to="/admin/gallery/new"
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Add New Image
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="md:w-64 relative">
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Locations</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {(searchTerm || selectedLocation) && (
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
      
      {/* Gallery Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader size={40} className="animate-spin text-primary-600 mr-3" />
            <span className="text-lg">Loading gallery...</span>
          </div>
        ) : filteredGallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGallery.map(item => (
              <div 
                key={item.id} 
                className="group relative border border-gray-200 rounded-lg overflow-hidden"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-48 object-cover"
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/300x200")}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button 
                      className="p-2 bg-white rounded-full text-primary-600 hover:text-primary-800"
                      title="View"
                      onClick={() => setSelectedImage(item)}
                    >
                      <Eye size={18} />
                    </button>
                    <Link
                      to={`/admin/gallery/edit/${item.id}`}
                      className="p-2 bg-white rounded-full text-indigo-600 hover:text-indigo-800"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <button 
                      className="p-2 bg-white rounded-full text-red-600 hover:text-red-800"
                      title="Delete"
                      onClick={() => deleteGalleryItem(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No images found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && filteredGallery.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredGallery.length}</span> of{' '}
              <span className="font-medium">{gallery.length}</span> images
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 border border-gray-300 rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="p-2 border border-gray-300 rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Image Preview Modal */}
      {selectedImage && (
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
                        Image Details
                      </h3>
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    <div>
                      <img
                        src={selectedImage.image}
                        alt={selectedImage.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                        onError={(e) => (e.currentTarget.src = "https://placehold.co/800x400")}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Title</p>
                          <p className="font-medium">{selectedImage.title}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{selectedImage.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Link
                  to={`/admin/gallery/edit/${selectedImage.id}`}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedImage(null)}
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

export default GalleryPage;