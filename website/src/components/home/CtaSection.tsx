import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="relative py-20">
      <div 
        className="absolute inset-0 bg-cta-pattern bg-cover bg-center"
        style={{ 
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for an Unforgettable Adventure?
          </h2>
          <p className="text-gray-200 text-lg mb-8">
            Book your dream vacation today and experience the breathtaking beauty of Jammu, Kashmir, Ladakh, and Gurez. Our expert guides will ensure a memorable journey.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/packages" 
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center justify-center"
            >
              Explore Packages
              <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;