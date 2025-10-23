import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertCircle } from 'lucide-react';
import { supabase, Destination } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const DestinationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    if (!id) {
      setError('Destination ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', parseInt(id))
        .single();
      
      if (fetchError) {
        console.error('Error fetching destination:', fetchError);
        setError('Destination not found');
        toast.error('Failed to load destination');
        return;
      }
      
      if (data) {
        setDestination(data);
        document.title = `${data.name} | JKLG Travel Agency`;
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load destination');
      toast.error('An error occurred while loading the destination');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">Destination Not Found</h2>
              <p className="text-red-700 mb-4">{error || 'The destination you are looking for does not exist.'}</p>
              <button
                onClick={() => navigate('/destinations')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all destinations
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Destinations
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          {/* Hero Image */}
          <div className="mb-8">
            <img
              src={destination.image}
              alt={destination.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
              onError={(e) => (e.currentTarget.src = "https://placehold.co/1200x400?text=Image+Not+Available")}
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {destination.name}
                </h1>
                <div className="flex items-center text-lg text-gray-600 mb-4">
                  <MapPin size={20} className="text-primary-600 mr-2" />
                  {destination.region}
                </div>
              </div>
              <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-lg">
                {destination.region}
              </div>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-12">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Region</h3>
              <p className="text-gray-700">{destination.region}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">About This Destination</h2>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {destination.description}
            </p>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in visiting {destination.name}?</h2>
            <p className="text-xl mb-6 opacity-90">
              Check out our packages and start planning your adventure today
            </p>
            <button
              onClick={() => navigate('/packages')}
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition inline-block"
            >
              View Packages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;
