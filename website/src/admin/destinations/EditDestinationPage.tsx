import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const EditDestinationPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDestination();
    }
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
        setFormData({
          name: data.name,
          region: data.region,
          description: data.description,
          image: data.image,
          featured: data.featured,
          altitude: data.altitude || '',
          best_season: data.best_season || '',
          distance: data.distance || '',
          average_temperature: data.average_temperature || '',
          accommodation: data.accommodation || '',
          difficulty: data.difficulty || 'Easy',
          attractions: Array.isArray(data.attractions) ? data.attractions : [],
          activities: Array.isArray(data.activities) ? data.activities : [],
          best_for: Array.isArray(data.best_for) ? data.best_for : [],
          latitude: data.latitude || '',
          longitude: data.longitude || ''
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load destination');
      toast.error('An error occurred while loading the destination');
    } finally {
      setLoading(false);
    }
  };

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
      setSaving(true);
      const { error } = await supabase
        .from('destinations')
        .update({
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
        })
        .eq('id', parseInt(id!));

      if (error) throw error;

      toast.success('Destination updated successfully!');
      navigate('/admin/destinations');
    } catch (error) {
      console.error('Error updating destination:', error);
      toast.error('Failed to update destination');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size={32} className="animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
        <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/destinations')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Destination</h1>
          <p className="text-gray-600">Update destination details</p>
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
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Gulmarg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Kashmir">Kashmir</option>
                <option value="Jammu">Jammu</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Gurez">Gurez</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the destination"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              {formData.image && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-40 w-full object-cover rounded-lg border border-gray-300"
                    onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400?text=Invalid+URL")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Location & Climate Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Altitude (meters)
              </label>
              <input
                type="number"
                name="altitude"
                value={formData.altitude}
                onChange={handleChange}
                placeholder="e.g., 2600"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Season
              </label>
              <input
                type="text"
                name="best_season"
                value={formData.best_season}
                onChange={handleChange}
                placeholder="e.g., June to September"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance from Nearest City (km)
              </label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="e.g., 52"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Temperature
              </label>
              <input
                type="text"
                name="average_temperature"
                value={formData.average_temperature}
                onChange={handleChange}
                placeholder="e.g., 15-25°C"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accommodation Types
              </label>
              <input
                type="text"
                name="accommodation"
                value={formData.accommodation}
                onChange={handleChange}
                placeholder="e.g., Hotels, Hostels, Guesthouses"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Difficulty & Coordinates */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Difficulty & Coordinates</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g., 34.2143"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g., 75.5241"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Attractions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Main Attractions</h2>
          <div className="space-y-3">
            {formData.attractions.map((attraction, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={attraction}
                  onChange={(e) => handleArrayChange('attractions', index, e.target.value)}
                  placeholder={`Attraction ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('attractions', index)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('attractions')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium w-full"
            >
              + Add Attraction
            </button>
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Available Activities</h2>
          <div className="space-y-3">
            {formData.activities.map((activity, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => handleArrayChange('activities', index, e.target.value)}
                  placeholder={`Activity ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('activities', index)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('activities')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium w-full"
            >
              + Add Activity
            </button>
          </div>
        </div>

        {/* Best For */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Perfect For</h2>
          <div className="space-y-3">
            {formData.best_for.map((category: string, index: number) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => handleArrayChange('best_for', index, e.target.value)}
                  placeholder={`Category ${index + 1} (e.g., families, adventure, nature)`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('best_for', index)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('best_for')}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium w-full"
            >
              + Add Category
            </button>
          </div>
        </div>

        {/* Featured Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Additional Settings</h2>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
              Featured Destination
            </label>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Featured destinations will be displayed prominently on the homepage
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/destinations')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDestinationPage;
