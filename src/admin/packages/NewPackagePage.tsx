import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, ArrowLeft, Plus, Trash2 } from 'lucide-react';

const NewPackagePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    image: '',
    destinations: [''],
    featured: false,
    accommodations: '',
    included: [''],
    excluded: [''],
    itinerary: [{ day: 1, title: '', description: '' }]
  });
  
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
    // Re-number days
    const updatedItinerary = newItinerary.map((item, idx) => ({
      ...item,
      day: idx + 1
    }));
    setFormData({
      ...formData,
      itinerary: updatedItinerary
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to the backend
    alert('Package created successfully!');
    navigate('/admin/packages');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Add New Package</h1>
          <p className="text-gray-600">Create a new tour package in your inventory</p>
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
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            <Save size={18} className="mr-2" />
            Save Package
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
                placeholder="e.g. Kashmir Bliss: 6 Days Tour"
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
                  placeholder="e.g. 24999"
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
                  placeholder="e.g. 6"
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
              placeholder="Describe this package..."
              required
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Main Image URL
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
                  alt="Package preview"
                  className="w-full h-40 object-cover"
                />
              </div>
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
                  placeholder="e.g. Srinagar"
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
              placeholder="e.g. Luxury houseboats and 4-star hotels"
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
                  placeholder="e.g. Airport transfers"
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
                  placeholder="e.g. Airfare"
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
                  placeholder="e.g. Arrival in Srinagar"
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
                placeholder="Describe the activities for this day..."
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
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
        >
          Create Package
        </button>
      </div>
    </div>
  );
};

export default NewPackagePage;