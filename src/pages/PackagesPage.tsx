import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { packages } from '../data/packages';
import { Clock, Calendar, Star, ArrowRight, Search, Filter, X } from 'lucide-react';

const PackagesPage = () => {
  const [filteredPackages, setFilteredPackages] = useState(packages);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Tour Packages | JKLG Travel Agency';
  }, []);

  // Extract all unique regions from packages destinations
  const regions = [...new Set(packages.flatMap(pkg => pkg.destinations))].sort();

  // Filter and sort packages
  useEffect(() => {
    let result = [...packages];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.destinations.some(dest => dest.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by region
    if (selectedRegion) {
      result = result.filter(pkg => pkg.destinations.includes(selectedRegion));
    }
    
    // Sort packages
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'duration-low') {
      result.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === 'duration-high') {
      result.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredPackages(result);
  }, [searchTerm, selectedRegion, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setSortBy('');
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-24 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Tour Packages
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover our carefully curated travel experiences across Jammu, Kashmir, Ladakh, and Gurez
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="appearance-none bg-white pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Destinations</option>
                  {regions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                  ))}
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration-low">Duration: Shortest First</option>
                  <option value="duration-high">Duration: Longest First</option>
                  <option value="rating">Top Rated</option>
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {(searchTerm || selectedRegion || sortBy) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                >
                  <X size={16} className="mr-2" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map(pkg => (
                <div 
                  key={pkg.id} 
                  className="bg-white rounded-xl overflow-hidden shadow-md card-hover"
                >
                  <div className="relative h-56 overflow-hidden">
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
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{pkg.title}</h3>
                    
                    <div className="flex flex-wrap gap-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center mr-4">
                        <Clock size={16} className="mr-1" />
                        {pkg.duration} Days
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1" />
                        {pkg.destinations.join(', ')}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-5 text-sm line-clamp-3">
                      {pkg.description}
                    </p>

                    <Link 
                      to={`/packages/${pkg.id}`}
                      className="w-full inline-flex justify-center items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
                    >
                      View Details
                      <ArrowRight size={18} className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No packages found</h3>
              <p className="text-gray-600 mb-8">Try changing your search criteria or explore our featured packages.</p>
              <button onClick={clearFilters} className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;