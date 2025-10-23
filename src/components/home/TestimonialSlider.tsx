import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, Testimonial } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const TestimonialSlider = () => {
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Fetch published testimonials from the database
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'published')
          .order('id', { ascending: false })
          .limit(10);
          
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
    }
    
    fetchTestimonials();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        }
      }
    ]
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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read authentic reviews from travelers who have experienced our tours
          </p>
        </div>

        <div className="testimonial-slider">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-6 h-56 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex items-center">
                    <div className="rounded-full bg-gray-200 h-12 w-12 mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <Slider {...settings}>
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="px-3">
                  <div className="bg-white shadow-md rounded-xl p-6 h-full">
                    <div className="flex mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-gray-600 mb-6 italic">
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
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No testimonials available at the moment.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/testimonials"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
          >
            View All Testimonials
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;