import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

const EditPackagePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    image: '',
    destinations: [''],
    featured: false,
    rating: 0,
    accommodations: '',
    included: [''],
    excluded: [''],
    itinerary: [{ day: 1, title: '', description: '' }]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPackage();
      fetchItinerary();
    }
  }, [id]);

  const fetchPackage = async () => {
    if (!id) {
      setError('Package ID is missing');
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('packages')
        .select('*')
        .eq('id', parseInt(id))
        .single();

      if (fetchError) {
        console.error('Error fetching package:', fetchError);
        setError('Package not found');
        toast.error('Failed to load package');
        return;
      }

      if (data) {
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price.toString(),
          duration: data.duration.toString(),
          image: data.image,
          destinations: data.destinations || [''],
          featured: data.featured,
          rating: data.rating || 0,
          accommodations: data.accommodations,
          included: data.included || [''],
          excluded: data.excluded || [''],
          itinerary: [{ day: 1, title: '', description: '' }]
        });
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load package');
      toast.error('An error occurred while loading the package');
    }
  };

  const fetchItinerary = async () => {
    if (!id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('itineraries')
        .select('*')
        .eq('package_id', parseInt(id))
        .order('day', { ascending: true });

      if (fetchError) {
        console.error('Error fetching itinerary:', fetchError);
        return;
      }

      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          itinerary: data.map((item: any) => ({
            day: item.day,
            title: item.title,
            description: item.description
          }))
        }));
      }
    } catch (err) {
      console.error('Error fetching itinerary:', err);
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

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...formData.destinations];
    newDestinations[index] = value;
    setFormData({
      ...formData,
      destinations: newDestinations
    });
  };

  const addDestination = () => {
    setFormData({
      ...formData,
      destinations: [...formData.destinations, '']
    });
  };

  const removeDestination = (index: number) => {
    const newDestinations = [...formData.destinations];
    newDestinations.splice(index, 1);
    setFormData({
      ...formData,
      destinations: newDestinations
    });
  };

  const handleIncludedChange = (index: number, value: string) => {
    const newIncluded = [...formData.included];
    newIncluded[index] = value;
    setFormData({
      ...formData,
      included: newIncluded
    });
  };

  const addIncluded = () => {
    setFormData({
      ...formData,
      included: [...formData.included, '']
    });
  };

  const removeIncluded = (index: number) => {
    const newIncluded = [...formData.included];
    newIncluded.splice(index, 1);
    setFormData({
      ...formData,
      included: newIncluded
    });
  };

  const handleExcludedChange = (index: number, value: string) => {
    const newExcluded = [...formData.excluded];
    newExcluded[index] = value;
    setFormData({
      ...formData,
      excluded: newExcluded
    });
  };

  const addExcluded = () => {
    setFormData({
      ...formData,
      excluded: [...formData.excluded, '']
    });
  };

  const removeExcluded = (index: number) => {
    const newExcluded = [...formData.excluded];
    newExcluded.splice(index, 1);
    setFormData({
      ...formData,
      excluded: newExcluded
    });
  };

  const handleItineraryChange = (index: number, field: string, value: string | number) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = {
      ...newItinerary[index],
      [field]: value
    };
    setFormData({
      ...formData,
      itinerary: newItinerary
    });
  };

  const addItineraryDay = () => {
    const newDay = formData.itinerary.length + 1;
    setFormData({
      ...formData,
      itinerary: [
        ...formData.itinerary,
        { day: newDay, title: '', description: '' }
      ]
    });
  };

  const removeItineraryDay = (index: number) => {
    const newItinerary = [...formData.itinerary];
    newItinerary.splice(index, 1);
    const updatedItinerary = newItinerary.map((item, idx) => ({
      ...item,
      day: idx + 1
    }));
    setFormData({
      ...formData,
      itinerary: updatedItinerary
    });
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.price || !formData.duration || !formData.image || !formData.accommodations) {
      toast.error('Please fill all required fields');
      return false;
    }

    if (formData.destinations.some(dest => !dest.trim())) {
      toast.error('Please fill all destination fields or remove empty ones');
      return false;
    }

    if (formData.included.some(item => !item.trim())) {
      toast.error('Please fill all included items or remove empty ones');
      return false;
    }

    if (formData.excluded.some(item => !item.trim())) {
      toast.error('Please fill all excluded items or remove empty ones');
      return false;
    }

    if (formData.itinerary.some(day => !day.title || !day.description)) {
      toast.error('Please complete all itinerary days');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      // Update package
      const { error: updateError } = await supabase
        .from('packages')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price),
          duration: parseInt(formData.duration),
          image: formData.image,
          destinations: formData.destinations.filter(d => d.trim()),
          featured: formData.featured,
          rating: formData.rating || 0,
          accommodations: formData.accommodations,
          included: formData.included.filter(i => i.trim()),
          excluded: formData.excluded.filter(e => e.trim())
        })
        .eq('id', parseInt(id!));

      if (updateError) throw updateError;

      // Delete old itinerary
      const { error: deleteError } = await supabase
        .from('itineraries')
        .delete()
        .eq('package_id', parseInt(id!));

      if (deleteError) {
        console.error('Error deleting itinerary:', deleteError);
      } else {
        // Insert new itinerary
        const itineraryData = formData.itinerary.map(day => ({
          package_id: parseInt(id!),
          day: day.day,
          title: day.title,
          description: day.description
        }));

        const { error: itineraryError } = await supabase
          .from('itineraries')
          .insert(itineraryData);

        if (itineraryError) {
          console.error('Error updating itinerary:', itineraryError);
          toast.error('Package updated but there was an error with the itinerary');
        } else {
          toast.success('Package updated successfully!');
        }
      }

      navigate('/admin/packages');
    } catch (error) {
      console.error('Error updating package:', error);
      toast.error('Failed to update package');
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
            onClick={() => navigate('/admin/packages')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Package</h1>
          <p className="text-gray-600">Update tour package details</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/admin/packages')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg inline-flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Packages
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Package Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
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
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Main Image URL
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {formData.image && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Preview
              </label>
              <img
                src={formData.image}
                alt="Package preview"
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => (e.currentTarget.src = "https://placehold.co/800x400")}
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destinations
            </label>
            {formData.destinations.map((destination, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => handleDestinationChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mr-2"
                  required
                />
                {formData.destinations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDestination(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addDestination}
              className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <Plus size={18} className="mr-1" />
              Add Destination
            </button>
          </div>

          <div className="mb-6">
            <label htmlFor="accommodations" className="block text-sm font-medium text-gray-700 mb-1">
              Accommodations
            </label>
            <input
              type="text"
              id="accommodations"
              name="accommodations"
              value={formData.accommodations}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
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
                Feature this package on the homepage
              </label>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">What's Included & Excluded</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Included in Package</h3>
            {formData.included.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleIncludedChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mr-2"
                  required
                />
                {formData.included.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIncluded(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIncluded}
              className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <Plus size={18} className="mr-1" />
              Add Item
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Excluded from Package</h3>
            {formData.excluded.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleExcludedChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mr-2"
                  required
                />
                {formData.excluded.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExcluded(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addExcluded}
              className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <Plus size={18} className="mr-1" />
              Add Item
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Itinerary</h2>

        {formData.itinerary.map((day, index) => (
          <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Day {day.day}</h3>
              {formData.itinerary.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItineraryDay(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor={`day-${day.day}-title`} className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id={`day-${day.day}-title`}
                  value={day.title}
                  onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor={`day-${day.day}-description`} className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id={`day-${day.day}-description`}
                value={day.description}
                onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              ></textarea>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addItineraryDay}
          className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
        >
          <Plus size={18} className="mr-2" />
          Add Day
        </button>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => navigate('/admin/packages')}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default EditPackagePage;
