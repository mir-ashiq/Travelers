import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase, Destination } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const FeaturedDestinations = () => {
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  
  // Fetch featured destinations from the database
  useEffect(() => {
    async function fetchDestinations() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .eq('featured', true)
          .limit(6);
          
        if (error) throw error;
        
        if (data) {
          setDestinations(data);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        toast.error('Failed to load destinations');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDestinations();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Top Destinations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the most breathtaking and popular destinations across Jammu, Kashmir, Ladakh, and Gurez
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-60 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : destinations.length > 0 ? (
            destinations.map(destination => (
              <div 
                key={destination.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md card-hover"
              >
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+Not+Available")}
                  />
                  <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {destination.region}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      to={`/destinations/${destination.id}`}
                      className="text-primary-600 font-medium inline-flex items-center hover:text-primary-700 transition"
                    >
                      Explore
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600">No featured destinations available at the moment.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/destinations"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
          >
            View All Destinations
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;