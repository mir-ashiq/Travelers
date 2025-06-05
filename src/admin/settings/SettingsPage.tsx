import React, { useState } from 'react';
import { Save, Upload, X, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [siteName, setSiteName] = useState('JKLG Travel Agency');
  const [siteEmail, setSiteEmail] = useState('info@jklgtravel.com');
  const [sitePhone, setSitePhone] = useState('+91 98765 43210');
  const [siteAddress, setSiteAddress] = useState('123 Tourism Road, Srinagar, Jammu & Kashmir, India');
  const [heroSlides, setHeroSlides] = useState([
    {
      id: 1,
      title: 'Discover Paradise on Earth',
      subtitle: 'Experience the breathtaking beauty of Kashmir',
      cta: 'Explore Packages',
      link: '/packages',
      image: 'https://images.pexels.com/photos/1486520/pexels-photo-1486520.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      id: 2,
      title: 'Adventure Awaits in Ladakh',
      subtitle: 'Journey through the roof of the world',
      cta: 'View Destinations',
      link: '/destinations',
      image: 'https://images.pexels.com/photos/5583514/pexels-photo-5583514.jpeg?auto=compress&cs=tinysrgb&w=1920'
    },
    {
      id: 3,
      title: 'Discover Hidden Gems',
      subtitle: 'Explore the untouched beauty of Gurez Valley',
      cta: 'Book Now',
      link: '/packages',
      image: 'https://images.pexels.com/photos/2105833/pexels-photo-2105833.jpeg?auto=compress&cs=tinysrgb&w=1920'
    }
  ]);
  const [selectedSlide, setSelectedSlide] = useState<any>(null);
  
  // Social media links
  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com/jklgtravel',
    instagram: 'https://instagram.com/jklgtravel',
    twitter: 'https://twitter.com/jklgtravel',
    youtube: 'https://youtube.com/jklgtravel'
  });
  
  const [emailTemplates, setEmailTemplates] = useState([
    { id: 1, name: 'Booking Confirmation', subject: 'Your booking is confirmed!' },
    { id: 2, name: 'Booking Cancellation', subject: 'Your booking has been cancelled' },
    { id: 3, name: 'Welcome Email', subject: 'Welcome to JKLG Travel!' },
    { id: 4, name: 'Feedback Request', subject: 'How was your experience with JKLG Travel?' }
  ]);
  
  const handleSaveSettings = () => {
    // In a real app, this would save to your backend
    alert('Settings saved successfully!');
  };

  const editSlide = (slide: any) => {
    setSelectedSlide(slide);
  };

  const removeSlide = (id: number) => {
    setHeroSlides(heroSlides.filter(slide => slide.id !== id));
  };

  const updateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroSlides(prev => 
      prev.map(slide => slide.id === selectedSlide.id ? selectedSlide : slide)
    );
    setSelectedSlide(null);
  };

  const addNewSlide = () => {
    const newSlide = {
      id: Date.now(), // Use timestamp as unique ID
      title: 'New Slide Title',
      subtitle: 'New slide subtitle goes here',
      cta: 'Click Here',
      link: '/packages',
      image: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1920'
    };
    
    setHeroSlides([...heroSlides, newSlide]);
    setSelectedSlide(newSlide);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-gray-600">Manage and customize your travel agency website</p>
        </div>
        <button 
          onClick={handleSaveSettings}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
        >
          <Save size={18} className="mr-2" />
          Save Changes
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            <button
              onClick={() => setActiveTab('general')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'general'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General Settings
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'hero'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hero Carousel
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'social'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Social Media
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'email'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Email Templates
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Company Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input 
                      type="text" 
                      id="siteName" 
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Logo
                    </label>
                    <div className="flex items-center">
                      <div className="w-16 h-16 flex items-center justify-center bg-primary-600 text-white rounded-full mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12h20"/>
                          <path d="M12 2a10 10 0 1 0 10 10"/>
                          <path d="M12 2v10l4-4"/>
                          <path d="M12 2v10l-4-4"/>
                          <path d="M8.5 7a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z"/>
                        </svg>
                      </div>
                      <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm inline-flex items-center">
                        <Upload size={16} className="mr-2" />
                        Upload New Logo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="siteEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      id="siteEmail" 
                      value={siteEmail}
                      onChange={(e) => setSiteEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sitePhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input 
                      type="text" 
                      id="sitePhone" 
                      value={sitePhone}
                      onChange={(e) => setSitePhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="siteAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Office Address
                    </label>
                    <textarea 
                      id="siteAddress" 
                      rows={3}
                      value={siteAddress}
                      onChange={(e) => setSiteAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-4">SEO Settings</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Title
                    </label>
                    <input 
                      type="text" 
                      id="metaTitle" 
                      defaultValue="JKLG Travel Agency | Explore Jammu, Kashmir, Ladakh, and Gurez"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea 
                      id="metaDescription" 
                      rows={3}
                      defaultValue="Discover the breathtaking beauty of Jammu, Kashmir, Ladakh, and Gurez with our expertly crafted tour packages. Create unforgettable memories with JKLG Travel Agency."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Hero Carousel Tab */}
          {activeTab === 'hero' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Hero Carousel Slides</h2>
                <button 
                  onClick={addNewSlide}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add New Slide
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {heroSlides.map(slide => (
                  <div 
                    key={slide.id} 
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-24"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-bold">{slide.title}</h3>
                        <p className="text-white text-sm opacity-90">{slide.subtitle}</p>
                      </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        CTA: <span className="font-medium text-gray-700">{slide.cta}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => editSlide(slide)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => removeSlide(slide.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Hero slide preview */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img 
                      src={heroSlides[0].image} 
                      alt={heroSlides[0].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="absolute inset-0 flex items-center">
                      <div className="container mx-auto px-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                          {heroSlides[0].title}
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mb-6">
                          {heroSlides[0].subtitle}
                        </p>
                        <button className="bg-primary-600 text-white font-medium py-2 px-6 rounded-lg">
                          {heroSlides[0].cta}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4">Social Media Links</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook
                  </label>
                  <input 
                    type="url" 
                    id="facebook" 
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <input 
                    type="url" 
                    id="instagram" 
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({...socialLinks, instagram: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter
                  </label>
                  <input 
                    type="url" 
                    id="twitter" 
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                
                <div>
                  <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube
                  </label>
                  <input 
                    type="url" 
                    id="youtube" 
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({...socialLinks, youtube: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://youtube.com/yourchannel"
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      These social media links will appear in the website footer and can be used to drive traffic to your social media profiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Email Templates Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4">Email Templates</h2>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {emailTemplates.map((template) => (
                      <tr key={template.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {template.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {template.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Email Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fromName" className="block text-sm font-medium text-gray-700 mb-1">
                      From Name
                    </label>
                    <input 
                      type="text" 
                      id="fromName" 
                      defaultValue="JKLG Travel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      From Email
                    </label>
                    <input 
                      type="email" 
                      id="fromEmail" 
                      defaultValue="bookings@jklgtravel.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="emailFooter" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Footer Text
                    </label>
                    <textarea 
                      id="emailFooter" 
                      rows={3}
                      defaultValue="© 2025 JKLG Travel Agency. All rights reserved. 123 Tourism Road, Srinagar, Jammu & Kashmir, India"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Slide Edit Modal */}
      {selectedSlide && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={updateSlide}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Edit Slide
                        </h3>
                        <button 
                          type="button"
                          onClick={() => setSelectedSlide(null)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="slideTitle" className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            id="slideTitle"
                            value={selectedSlide.title}
                            onChange={(e) => setSelectedSlide({...selectedSlide, title: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="slideSubtitle" className="block text-sm font-medium text-gray-700">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            id="slideSubtitle"
                            value={selectedSlide.subtitle}
                            onChange={(e) => setSelectedSlide({...selectedSlide, subtitle: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="slideCta" className="block text-sm font-medium text-gray-700">
                              CTA Text
                            </label>
                            <input
                              type="text"
                              id="slideCta"
                              value={selectedSlide.cta}
                              onChange={(e) => setSelectedSlide({...selectedSlide, cta: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="slideLink" className="block text-sm font-medium text-gray-700">
                              CTA Link
                            </label>
                            <input
                              type="text"
                              id="slideLink"
                              value={selectedSlide.link}
                              onChange={(e) => setSelectedSlide({...selectedSlide, link: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="slideImage" className="block text-sm font-medium text-gray-700">
                            Image URL
                          </label>
                          <input
                            type="text"
                            id="slideImage"
                            value={selectedSlide.image}
                            onChange={(e) => setSelectedSlide({...selectedSlide, image: e.target.value})}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview
                          </label>
                          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                            {selectedSlide.image && (
                              <img
                                src={selectedSlide.image}
                                alt="Slide preview"
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSlide(null)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;