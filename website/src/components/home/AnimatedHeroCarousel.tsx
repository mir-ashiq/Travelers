import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1486520/pexels-photo-1486520.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Discover Paradise on Earth',
    subtitle: 'Experience the breathtaking beauty of Kashmir',
    cta: 'Explore Packages',
    link: '/packages'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/5583514/pexels-photo-5583514.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Adventure Awaits in Ladakh',
    subtitle: 'Journey through the roof of the world',
    cta: 'View Destinations',
    link: '/destinations'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/2105833/pexels-photo-2105833.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Discover Hidden Gems',
    subtitle: 'Explore the untouched beauty of Gurez Valley',
    cta: 'Book Now',
    link: '/packages'
  }
];

const AnimatedHeroCarousel = () => {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [autoplayActive, setAutoplayActive] = useState(true);

  useEffect(() => {
    const loadSlides = async () => {
      try {
        const { data } = await (supabase as any)
          .from('site_settings')
          .select('value')
          .eq('key', 'hero_slides')
          .single();

        if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
          setSlides(data.value);
        }
      } catch (error) {
        console.error('Error loading hero slides:', error);
      }
    };

    loadSlides();
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (!autoplayActive) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [autoplayActive, slides.length]);

  const goToPrevious = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoplayActive(false);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setAutoplayActive(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setAutoplayActive(false);
  };

  return (
    <div className="relative overflow-hidden h-[600px] md:h-[700px]">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          index === current && (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Background Image */}
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 8, ease: 'easeOut' }}
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </motion.div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-center items-start px-8 md:px-16 container">
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-shadow max-w-4xl"
                >
                  {slide.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-white text-xl md:text-2xl max-w-2xl mb-8 text-shadow"
                >
                  {slide.subtitle}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={slide.link}
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-full transition duration-300 inline-flex items-center shadow-lg"
                  >
                    {slide.cta}
                    <ArrowRight size={20} className="ml-2" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.button
        onClick={goToPrevious}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft size={28} />
      </motion.button>

      <motion.button
        onClick={goToNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all"
        aria-label="Next slide"
      >
        <ChevronRight size={28} />
      </motion.button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === current ? 'bg-white w-8' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedHeroCarousel;
