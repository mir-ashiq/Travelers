import React, { useState } from 'react';
import { Eye, Check, X, Search, Star, MessageSquare, AlertCircle } from 'lucide-react';
import { testimonials as initialTestimonials } from '../../data/testimonials';

const TestimonialsPage = () => {
  // Add a status field to each testimonial (published, pending, rejected)
  const extendedTestimonials = initialTestimonials.map((t, index) => ({
    ...t,
    status: index < 4 ? 'published' : index < 6 ? 'pending' : 'rejected',
    date: new Date(2025, 5 - index, 15 - index).toISOString().split('T')[0]
  }));

  // Add a few pending testimonials for the admin to review
  const pendingTestimonials = [
    {
      id: initialTestimonials.length + 1,
      name: 'Sanjay Mehta',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Bengaluru, India',
      rating: 5,
      message: 'The Kashmir Bliss tour exceeded all expectations. The houseboat experience on Dal Lake was magical, and our guide was incredibly knowledgeable. Will definitely recommend to friends and family!',
      status: 'pending',
      date: '2025-05-02'
    },
    {
      id: initialTestimonials.length + 2,
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Manchester, UK',
      rating: 4,
      message: 'Our Ladakh trip was incredible. The landscapes are out of this world. Only feedback would be that some accommodations could be improved, but overall an amazing adventure.',
      status: 'pending',
      date: '2025-05-03'
    }
  ];

  const [testimonials, setTestimonials] = useState([...extendedTestimonials, ...pendingTestimonials]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

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
  const changeStatus = (id: number, status: string) => {
    setTestimonials(testimonials.map(testimonial => 
      testimonial.id === id ? {...testimonial, status} : testimonial
    ));
    
    // Update status in modal if open
    if (selectedTestimonial && selectedTestimonial.id === id) {
      setSelectedTestimonial({...selectedTestimonial, status});
    }
  };

  // View testimonial details
  const viewTestimonial = (testimonial: any) => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map(testimonial => (
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
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => changeStatus(testimonial.id, 'rejected')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                  
                  {testimonial.status === 'published' && (
                    <button 
                      onClick={() => changeStatus(testimonial.id, 'rejected')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  )}
                  
                  {testimonial.status === 'rejected' && (
                    <button 
                      onClick={() => changeStatus(testimonial.id, 'published')}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Check size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredTestimonials.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No testimonials found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      
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