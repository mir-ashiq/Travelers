import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Star } from 'lucide-react';
import { packages } from '../../data/packages';

const PopularPackages = () => {
  // Filter to get only featured packages (max 4)
  const featuredPackages = packages
    .filter(pkg => pkg.featured)
    .slice(0, 4);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Popular Tour Packages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most sought-after travel experiences, curated to give you unforgettable memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredPackages.map(pkg => (
            <div 
              key={pkg.id} 
              className="bg-white rounded-xl overflow-hidden shadow-md card-hover"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24"></div>
                <div className="absolute bottom-3 left-3 flex items-center">
                  <div className="bg-white rounded px-2 py-1 text-sm font-semibold text-primary-600 flex items-center">
                    <Star size={14} className="fill-current text-yellow-500 mr-1" />
                    {pkg.rating}
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-accent-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  ₹{pkg.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold mb-2 line-clamp-1">{pkg.title}</h3>
                
                <div className="flex flex-wrap gap-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center mr-4">
                    <Clock size={14} className="mr-1" />
                    {pkg.duration} Days
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {pkg.destinations.join(', ')}
                  </div>
                </div>

                <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                  {pkg.description}
                </p>

                <Link 
                  to={`/packages/${pkg.id}`}
                  className="w-full inline-flex justify-center items-center bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-300"
                >
                  View Details
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/packages"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
          >
            View All Packages
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;