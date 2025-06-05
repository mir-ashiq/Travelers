import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Search, Star, MessageSquare, AlertCircle, Loader } from 'lucide-react';
import { supabase, Testimonial } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from the database
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={18} 
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  // Filter testimonials based on search term and status
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = 
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter ? testimonial.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Handle status change
  const changeStatus = async (id: number, status: 'published' | 'pending' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      setTestimonials(testimonials.map(testimonial => 
        testimonial.id === id ? {...testimonial, status} : testimonial
      ));
      
      // Update status in modal if open
      if (selectedTestimonial && selectedTestimonial.id === id) {
        setSelectedTestimonial({...selectedTestimonial, status});
      }
      
      toast.success(`Testimonial status changed to ${status}`);
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      toast.error('Failed to update testimonial status');
    }
  };

  // View testimonial details
  const viewTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
  };

  // Close testimonial modal
  const closeModal = () => {
    setSelectedTestimonial(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Testimonials</h1>
          <p className="text-gray-600">Review and manage customer testimonials</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Testimonials</option>
            <option value="published">Published</option>
            <option value="pending">Pending Review</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button
            onClick={() => fetchTestimonials()}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            <svg className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      
      {/* Pending testimonials highlight */}
      {testimonials.some(t => t.status === 'pending') && statusFilter !== 'published' && statusFilter !== 'rejected' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                There are {testimonials.filter(t => t.status === 'pending').length} testimonials pending review.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Testimonials Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Loader size={40} className="animate-spin text-primary-600 mr-3" />
          <span className="text-lg">Loading testimonials...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.length > 0 ? (
            filteredTestimonials.map(testimonial => (
              <div 
                key={testimonial.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover mr-4"
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/100")}
                      />
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      testimonial.status === 'published' ? 'bg-green-100 text-green-800' : 
                      testimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="flex mb-3">
                    {renderStars(testimonial.rating)}
                    <span className="ml-2 text-sm text-gray-500">{testimonial.date}</span>
                  </div>
                  
                  <div className="relative">
                    <MessageSquare size={24} className="absolute left-0 top-0 text-gray-200" />
                    <p className="pl-8 text-gray-600 line-clamp-3">
                      "{testimonial.message}"
                    </p>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <button 
                      onClick={() => viewTestimonial(testimonial)}
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                    
                    <div className="flex space-x-2">
                      {testimonial.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => changeStatus(testimonial.id, 'published')}
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => changeStatus(testimonial.id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      
                      {testimonial.status === 'published' && (
                        <button 
                          onClick={() => changeStatus(testimonial.id, 'rejected')}
                          className="text-red-600 hover:text-red-800"
                          title="Remove from Published"
                        >
                          <X size={18} />
                        </button>
                      )}
                      
                      {testimonial.status === 'rejected' && (
                        <button 
                          onClick={() => changeStatus(testimonial.id, 'published')}
                          className="text-green-600 hover:text-green-800"
                          title="Publish"
                        >
                          <Check size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <AlertCircle size={48} className="text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No testimonials found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}
      
      {/* Testimonial Modal */}
      {selectedTestimonial && (
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
                        Testimonial Details
                      </h3>
                      <button 
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center mb-4">
                        <img 
                          src={selectedTestimonial.avatar} 
                          alt={selectedTestimonial.name} 
                          className="w-16 h-16 rounded-full object-cover mr-4"
                          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/100")}
                        />
                        <div>
                          <h4 className="font-semibold text-lg">{selectedTestimonial.name}</h4>
                          <p className="text-gray-500">{selectedTestimonial.location}</p>
                          <div className="flex mt-1">
                            {renderStars(selectedTestimonial.rating)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-gray-700 italic">
                          "{selectedTestimonial.message}"
                        </p>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Submitted: {selectedTestimonial.date}</span>
                        <span className={`px-2 py-1 rounded font-medium ${
                          selectedTestimonial.status === 'published' ? 'bg-green-100 text-green-800' : 
                          selectedTestimonial.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedTestimonial.status.charAt(0).toUpperCase() + selectedTestimonial.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedTestimonial.status === 'pending' && (
                  <>
                    <button 
                      type="button" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => changeStatus(selectedTestimonial.id, 'published')}
                    >
                      <Check size={18} className="mr-2" />
                      Approve
                    </button>
                    <button 
                      type="button" 
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => changeStatus(selectedTestimonial.id, 'rejected')}
                    >
                      <X size={18} className="mr-2" />
                      Reject
                    </button>
                  </>
                )}
                
                {selectedTestimonial.status === 'published' && (
                  <button 
                    type="button" 
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => changeStatus(selectedTestimonial.id, 'rejected')}
                  >
                    <X size={18} className="mr-2" />
                    Remove from Published
                  </button>
                )}
                
                {selectedTestimonial.status === 'rejected' && (
                  <button 
                    type="button" 
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => changeStatus(selectedTestimonial.id, 'published')}
                  >
                    <Check size={18} className="mr-2" />
                    Publish
                  </button>
                )}
                
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

export default TestimonialsPage;