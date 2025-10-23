import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase, Testimonial } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { staggerContainer, staggerItem } from '../../lib/animations';

const AnimatedTestimonialSlider = () => {
  const [loading, setLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

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

  // Auto advance slides
  useEffect(() => {
    if (testimonials.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
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

  // Get visible testimonials (current + next 2)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < Math.min(3, testimonials.length); i++) {
      visible.push(testimonials[(current + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-16 bg-white"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={staggerItem}
            className="text-3xl md:text-4xl font-bold font-heading mb-4"
          >
            What Our Travelers Say
          </motion.h2>
          <motion.p variants={staggerItem} className="text-gray-600 max-w-2xl mx-auto">
            Read authentic reviews from travelers who have experienced our tours
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative min-h-64">
          {loading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-100 rounded-xl p-6 h-56 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex items-center">
                    <div className="rounded-full bg-gray-200 h-12 w-12 mr-3"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white shadow-md rounded-xl p-6 h-full hover:shadow-lg transition-shadow"
                >
                  {/* Rating */}
                  <div className="flex mb-4 gap-1">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-600 mb-6 italic min-h-[80px]">
                    "{testimonial.message}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center">
                    <motion.img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/100')}
                      whileHover={{ scale: 1.1 }}
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600">No testimonials available at the moment.</p>
            </motion.div>
          )}

          {/* Navigation Arrows - Only show if more than 3 testimonials */}
          {testimonials.length > 3 && (
            <>
              <motion.button
                onClick={goToPrevious}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -left-12 md:-left-16 top-32 bg-gray-200 hover:bg-primary-600 hover:text-white text-gray-700 p-2 rounded-full transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </motion.button>

              <motion.button
                onClick={goToNext}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -right-12 md:-right-16 top-32 bg-gray-200 hover:bg-primary-600 hover:text-white text-gray-700 p-2 rounded-full transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </motion.button>
            </>
          )}
        </div>

        {/* View All Button */}
        {testimonials.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/testimonials"
                className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
              >
                View All Testimonials
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default AnimatedTestimonialSlider;
