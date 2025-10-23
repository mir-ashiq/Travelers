import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase, GalleryItem } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const GalleryPreview = () => {
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Fetch gallery items from the database
  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .limit(6);
          
        if (error) throw error;
        
        if (data) {
          setGalleryItems(data);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
        toast.error('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    }
    
    fetchGallery();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Our Gallery
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Immerse yourself in the stunning landscapes and vibrant culture of Jammu, Kashmir, Ladakh, and Gurez
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
            ))
          ) : galleryItems.length > 0 ? (
            galleryItems.map((item, index) => (
              <motion.div 
                key={item.id} 
                className="gallery-item relative rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Available")}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center p-4">
                    <h3 className="text-white text-lg font-semibold mb-1">{item.title}</h3>
                    <p className="text-white text-sm opacity-90">{item.location}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600">No gallery items available at the moment.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/gallery"
            className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300"
          >
            View Full Gallery
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;