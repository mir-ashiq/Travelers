import React, { useEffect, useState } from 'react';
import { Star, Quote, Loader } from 'lucide-react';
import { supabase, Testimonial, TourPackage } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Testimonials | JKLG Travel Agency';
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch testimonials
      const { data: testimonialData, error: testimonialError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'published')
        .order('id', { ascending: false });
      
      if (testimonialError) throw testimonialError;
      
      // Fetch packages for the dropdown
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('id, title')
        .order('title', { ascending: true });
      
      if (packageError) throw packageError;
      
      setTestimonials(testimonialData || []);
      setPackages(packageData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
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

  // Handle testimonial submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      setFormLoading(true);
      
      const testimonial = {
        name: formData.get('name') as string,
        location: 'Website User', // Default location
        rating: rating,
        message: formData.get('message') as string,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        avatar: 'https://placehold.co/100' // Default avatar
      };
      
      const { error } = await supabase
        .from('testimonials')
        .insert([testimonial]);
      
      if (error) throw error;
      
      toast.success('Thank you! Your testimonial has been submitted for review.');
      form.reset();
      setRating(0);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-24 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/5583514/pexels-photo-5583514.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Traveler Stories
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Read about the experiences of our valued customers and their unforgettable journeys
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-12">
            <div className="text-center mb-10">
              <Quote size={48} className="text-primary-100 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
              <p className="text-gray-600">
                We'd love to hear about your journey with JKLG Travel. Your feedback helps us improve our services and inspires fellow travelers.
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    placeholder="Your full name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    placeholder="Your email address"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="package" className="block text-sm font-medium text-gray-700 mb-1">Tour Package</label>
                <select 
                  id="package"
                  name="package"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select the tour you took</option>
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        size={32} 
                        className={`${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} hover:text-yellow-400 cursor-pointer`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Testimonial</label>
                <textarea 
                  id="message" 
                  name="message"
                  placeholder="Share your experience..."
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 flex items-center"
                >
                  {formLoading ? (
                    <>
                      <Loader size={20} className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Testimonial'
                  )}
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex items-center">
                    <div className="rounded-full bg-gray-200 h-12 w-12 mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map(testimonial => (
                <div 
                  key={testimonial.id} 
                  className="bg-white rounded-xl shadow-md p-6 relative"
                >
                  <Quote 
                    size={48} 
                    className="absolute right-6 top-6 text-gray-100" 
                  />
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-600 mb-6 italic relative z-10">
                    "{testimonial.message}"
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/100")}
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold mb-4">No testimonials yet</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Be the first to share your experience with us!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;