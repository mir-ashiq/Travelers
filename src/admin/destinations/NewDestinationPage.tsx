import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const NewDestinationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    region: 'Kashmir',
    description: '',
    image: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.image) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('destinations')
        .insert([
          {
            name: formData.name,
            region: formData.region,
            description: formData.description,
            image: formData.image,
            featured: formData.featured
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast.success('Destination created successfully!');
      navigate('/admin/destinations');
    } catch (error) {
      console.error('Error creating destination:', error);
      toast.error('Failed to create destination');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Add New Destination</h1>
          <p className="text-gray-600">Create a new travel destination in your inventory</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate('/admin/destinations')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Destinations
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Destination
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Destination Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. Dal Lake"
                required
              />
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="Kashmir">Kashmir</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Jammu">Jammu</option>
                <option value="Gurez">Gurez</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe this destination..."
              required
            ></textarea>
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
                  alt="Destination preview"
                  className="w-full h-40 object-cover"
                  onError={(e) => (e.currentTarget.src = "https://placehold.co/800x400")}
                />
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                Feature this destination on the homepage
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              onClick={() => navigate('/admin/destinations')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDestinationPage;