import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Star } from 'lucide-react';
import { supabase, TourPackage } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const PopularPackages = () => {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<TourPackage[]>([]);

  // Fetch featured packages from the database
  useEffect(() => {
    async function fetchPackages() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('featured', true)
          .limit(4);
          
        if (error) throw error;
        
        if (data) {
          setPackages(data);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        toast.error('Failed to load packages');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPackages();
  }, []);

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
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : packages.length > 0 ? (
            packages.map(pkg => (
              <div 
                key={pkg.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md card-hover"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/400x300?text=Image+Not+Available")}
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
            ))
          ) : (
            <div className="col-span-4 text-center py-12">
              <p className="text-gray-600">No featured packages available at the moment.</p>
            </div>
          )}
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