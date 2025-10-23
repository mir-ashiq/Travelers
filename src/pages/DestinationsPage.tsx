import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Loader } from 'lucide-react';
import { supabase, Destination } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Destinations | JKLG Travel Agency';
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('id', { ascending: true });
      
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
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-24 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/1486520/pexels-photo-1486520.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Destinations
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Explore the breathtaking beauty of Jammu, Kashmir, Ladakh, and Gurez
            </p>
          </div>
        </div>
      </div>

      {/* Destinations Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map(destination => (
                <div 
                  key={destination.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-md card-hover"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Available")}
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {destination.region}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-3">{destination.name}</h2>
                    <div className="flex items-start mb-4">
                      <MapPin size={18} className="text-primary-600 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-600">{destination.region}</p>
                    </div>
                    <p className="text-gray-600 mb-6">{destination.description}</p>
                    <Link 
                      to={`/destinations/${destination.id}`}
                      className="inline-flex items-center text-primary-600 font-medium hover:text-primary-700 transition"
                    >
                      Explore Destination
                      <ArrowRight size={18} className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && destinations.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-semibold mb-4">No destinations available</h3>
              <p className="text-gray-600 mb-8">Please check back later for updates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;