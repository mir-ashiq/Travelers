import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, ArrowLeft } from 'lucide-react';

const NewGalleryPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    image: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    alert('Image added to gallery successfully!');
    navigate('/admin/gallery');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Add New Image to Gallery</h1>
          <p className="text-gray-600">Upload a new image to showcase your destinations</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/admin/gallery')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Gallery
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            <Save size={18} className="mr-2" />
            Save Image
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Image Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Dal Lake Sunset"
                required
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Srinagar, Kashmir"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <div className="flex">
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://example.com/image.jpg"
                required
              />
              <button 
                type="button" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-r-lg inline-flex items-center"
              >
                <Upload size={18} className="mr-2" />
                Browse
              </button>
            </div>
          </div>
          
          {formData.image && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Preview
              </label>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={formData.image} 
                  alt="Gallery image preview"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              onClick={() => navigate('/admin/gallery')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGalleryPage;