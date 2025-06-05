import React, { useEffect, useState } from 'react';
import { gallery } from '../data/gallery';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGallery, setFilteredGallery] = useState(gallery);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Gallery | JKLG Travel Agency';
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredGallery(gallery.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredGallery(gallery);
    }
  }, [searchTerm]);

  const openImage = (id: number) => {
    setSelectedImage(id);
    document.body.style.overflow = 'hidden';
  };

  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedImage !== null) {
      if (e.key === 'Escape') {
        closeImage();
      } else if (e.key === 'ArrowRight') {
        const currentIndex = filteredGallery.findIndex(item => item.id === selectedImage);
        if (currentIndex < filteredGallery.length - 1) {
          setSelectedImage(filteredGallery[currentIndex + 1].id);
        }
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = filteredGallery.findIndex(item => item.id === selectedImage);
        if (currentIndex > 0) {
          setSelectedImage(filteredGallery[currentIndex - 1].id);
        }
      }
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1}>
      {/* Hero Section */}
      <div className="relative py-24 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our Gallery
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Immerse yourself in the breathtaking beauty of Jammu, Kashmir, Ladakh, and Gurez
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by location or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredGallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredGallery.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  className="gallery-item rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => openImage(item.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-start p-4">
                    <div>
                      <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                      <p className="text-white text-sm opacity-90">{item.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No gallery items found</h3>
              <p className="text-gray-600 mb-8">Try changing your search term or explore our featured gallery.</p>
              <button onClick={() => setSearchTerm('')} className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300">
                View All Images
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
            onClick={closeImage}
          >
            <X size={32} />
          </button>
          
          {filteredGallery.find(item => item.id === selectedImage) && (
            <div className="w-full max-w-5xl px-4">
              <img 
                src={filteredGallery.find(item => item.id === selectedImage)?.image} 
                alt={filteredGallery.find(item => item.id === selectedImage)?.title} 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="mt-4 text-white text-center">
                <h3 className="text-xl font-bold">{filteredGallery.find(item => item.id === selectedImage)?.title}</h3>
                <p className="text-gray-300">{filteredGallery.find(item => item.id === selectedImage)?.location}</p>
              </div>
            </div>
          )}
          
          <button 
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={() => {
              const currentIndex = filteredGallery.findIndex(item => item.id === selectedImage);
              if (currentIndex > 0) {
                setSelectedImage(filteredGallery[currentIndex - 1].id);
              }
            }}
            disabled={filteredGallery.findIndex(item => item.id === selectedImage) === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button 
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
            onClick={() => {
              const currentIndex = filteredGallery.findIndex(item => item.id === selectedImage);
              if (currentIndex < filteredGallery.length - 1) {
                setSelectedImage(filteredGallery[currentIndex + 1].id);
              }
            }}
            disabled={filteredGallery.findIndex(item => item.id === selectedImage) === filteredGallery.length - 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;