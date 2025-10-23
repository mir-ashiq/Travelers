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
    featured: false
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
          featured: data.featured
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
          featured: formData.featured
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
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400?text=Invalid+URL")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Settings */}
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
