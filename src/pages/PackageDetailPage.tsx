import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Users,
  Bed,
  Loader
} from 'lucide-react';
import { supabase, TourPackage, Itinerary } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const PackageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPackage();
  }, [id]);
  
  const fetchPackage = async () => {
    try {
      setLoading(true);
      if (!id) return;
      
      // Fetch the package
      const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (packageError) throw packageError;
      
      if (packageData) {
        setPkg(packageData);
        document.title = `${packageData.title} | JKLG Travel Agency`;
        
        // Fetch the itinerary for this package
        const { data: itineraryData, error: itineraryError } = await supabase
          .from('itineraries')
          .select('*')
          .eq('package_id', id)
          .order('day', { ascending: true });
        
        if (itineraryError) throw itineraryError;
        
        if (itineraryData) {
          setItinerary(itineraryData);
        }
      }
    } catch (error) {
      console.error('Error fetching package details:', error);
      toast.error('Failed to load package details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!pkg) return;
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const travel_date = formData.get('date') as string;
    const message = formData.get('message') as string;
    
    if (!name || !email || !phone || !travel_date) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const booking = {
        name,
        email,
        phone,
        package: pkg.title,
        travel_date,
        booking_date: new Date().toISOString().split('T')[0],
        amount: pkg.price,
        status: 'Pending',
        message: message || '',
        payment_status: 'Pending',
        source: 'Website'
      };
      
      const { error } = await supabase
        .from('bookings')
        .insert([booking]);
      
      if (error) throw error;
      
      toast.success('Your booking request has been submitted! We will contact you shortly.');
      form.reset();
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Loader size={50} className="text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading package details...</h2>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">Package Not Found</h1>
          <p className="text-gray-600 mb-8">The package you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/packages" 
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to All Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${pkg.image})` }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <Link 
              to="/packages"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to All Packages
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Clock size={18} className="text-primary-400 mr-2" />
                <span className="text-white">{pkg.duration} Days</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <MapPin size={18} className="text-primary-400 mr-2" />
                <span className="text-white">{pkg.destinations.join(', ')}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                <Star size={18} className="text-yellow-400 fill-yellow-400 mr-2" />
                <span className="text-white">{pkg.rating} Rating</span>
              </div>
            </div>
            <div className="mt-6 inline-block bg-accent-500 text-white font-semibold px-6 py-3 rounded-full text-xl">
              ₹{pkg.price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {pkg.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-gray-100 rounded-lg p-4 flex items-start w-full sm:w-auto">
                  <Clock size={22} className="text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Duration</h3>
                    <p className="text-gray-600">{pkg.duration} Days</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 flex items-start w-full sm:w-auto">
                  <MapPin size={22} className="text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Destinations</h3>
                    <p className="text-gray-600">{pkg.destinations.join(', ')}</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 flex items-start w-full sm:w-auto">
                  <Bed size={22} className="text-primary-600 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold">Accommodations</h3>
                    <p className="text-gray-600">{pkg.accommodations}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Tour Itinerary</h2>
              <div className="space-y-6">
                {itinerary.map((day, index) => (
                  <div 
                    key={day.id}
                    className="relative pl-8 pb-6 border-l-2 border-primary-200 last:border-0 last:pb-0"
                  >
                    <div className="absolute left-0 top-0 transform -translate-x-1/2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{day.day}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-5">
                      <h3 className="font-bold text-lg mb-2">{day.title}</h3>
                      <p className="text-gray-600">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <CheckCircle size={24} className="text-secondary-600 mr-2" />
                  What's Included
                </h2>
                <ul className="space-y-3">
                  {pkg.included.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle size={18} className="text-secondary-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <XCircle size={24} className="text-red-500 mr-2" />
                  What's Excluded
                </h2>
                <ul className="space-y-3">
                  {pkg.excluded.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <XCircle size={18} className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-center">Book This Tour</h2>
              
              <form className="space-y-4" onSubmit={handleBooking}>
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

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone"
                    placeholder="Your phone number"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="date" 
                      id="date"
                      name="date"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
                  <div className="relative">
                    <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select 
                      id="travelers"
                      name="travelers"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3">3 People</option>
                      <option value="4">4 People</option>
                      <option value="5">5 People</option>
                      <option value="6">6+ People</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <textarea 
                    id="message" 
                    name="message"
                    placeholder="Any special requests or questions?"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                >
                  Book Now
                </button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  No payment required to book. We'll contact you to confirm availability and process the booking.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;