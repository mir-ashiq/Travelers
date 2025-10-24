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
    featured: false,
    altitude: '',
    best_season: '',
    distance: '',
    average_temperature: '',
    accommodation: '',
    difficulty: 'Easy',
    attractions: [] as string[],
    activities: [] as string[],
    best_for: [] as string[],
    latitude: '',
    longitude: ''
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

  const handleArrayChange = (fieldName: 'attractions' | 'activities' | 'best_for', index: number, value: string) => {
    const arr = [...(formData[fieldName] as string[])];
    arr[index] = value;
    setFormData({
      ...formData,
      [fieldName]: arr
    });
  };

  const addArrayItem = (fieldName: 'attractions' | 'activities' | 'best_for') => {
    setFormData({
      ...formData,
      [fieldName]: [...(formData[fieldName] as string[]), '']
    });
  };

  const removeArrayItem = (fieldName: 'attractions' | 'activities' | 'best_for', index: number) => {
    const arr = (formData[fieldName] as string[]).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [fieldName]: arr
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
      const { error } = await supabase
        .from('destinations')
        .insert([
          {
            name: formData.name,
            region: formData.region,
            description: formData.description,
            image: formData.image,
            featured: formData.featured,
            altitude: formData.altitude ? parseInt(formData.altitude) : null,
            best_season: formData.best_season || null,
            distance: formData.distance ? parseInt(formData.distance) : null,
            average_temperature: formData.average_temperature || null,
            accommodation: formData.accommodation || null,
            difficulty: formData.difficulty,
            attractions: formData.attractions.filter((a: string) => a.trim()),
            activities: formData.activities.filter((a: string) => a.trim()),
            best_for: formData.best_for.filter((b: string) => b.trim()),
            latitude: formData.latitude ? parseFloat(formData.latitude) : null,
            longitude: formData.longitude ? parseFloat(formData.longitude) : null
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

          {/* Location & Climate Details */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Location & Climate Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Altitude (meters)
                </label>
                <input
                  type="number"
                  name="altitude"
                  value={formData.altitude}
                  onChange={handleChange}
                  placeholder="e.g., 2600"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Best Season
                </label>
                <input
                  type="text"
                  name="best_season"
                  value={formData.best_season}
                  onChange={handleChange}
                  placeholder="e.g., June to September"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance from Nearest City (km)
                </label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="e.g., 52"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Temperature
                </label>
                <input
                  type="text"
                  name="average_temperature"
                  value={formData.average_temperature}
                  onChange={handleChange}
                  placeholder="e.g., 15-25°C"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Accommodation Types
                </label>
                <input
                  type="text"
                  name="accommodation"
                  value={formData.accommodation}
                  onChange={handleChange}
                  placeholder="e.g., Hotels, Hostels, Guesthouses"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Difficulty & Coordinates */}
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Difficulty & Coordinates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g., 34.2143"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.000001"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g., 75.5241"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Attractions */}
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Main Attractions</h3>
            <div className="space-y-2">
              {formData.attractions.map((attraction, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={attraction}
                    onChange={(e) => handleArrayChange('attractions', index, e.target.value)}
                    placeholder={`Attraction ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('attractions', index)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('attractions')}
                className="w-full bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-lg font-medium"
              >
                + Add Attraction
              </button>
            </div>
          </div>

          {/* Activities */}
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Available Activities</h3>
            <div className="space-y-2">
              {formData.activities.map((activity, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => handleArrayChange('activities', index, e.target.value)}
                    placeholder={`Activity ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('activities', index)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('activities')}
                className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-lg font-medium"
              >
                + Add Activity
              </button>
            </div>
          </div>

          {/* Best For */}
          <div className="mb-6 bg-pink-50 border border-pink-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Perfect For</h3>
            <div className="space-y-2">
              {formData.best_for.map((category: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => handleArrayChange('best_for', index, e.target.value)}
                    placeholder={`Category ${index + 1} (e.g., families, adventure, nature)`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('best_for', index)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('best_for')}
                className="w-full bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-2 rounded-lg font-medium"
              >
                + Add Category
              </button>
            </div>
          </div>
          
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