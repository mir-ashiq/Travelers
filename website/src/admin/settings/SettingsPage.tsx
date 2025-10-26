import React, { useState, useEffect } from 'react';
import { Save, Upload, X, Plus, Edit2, Trash2, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [siteName, setSiteName] = useState('JKLG Travel Agency');
  const [siteEmails, setSiteEmails] = useState(['info@jklgtravel.com']);
  const [sitePhones, setSitePhones] = useState(['+91 98765 43210']);
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
  
  // SEO Settings
  const [metaTitle, setMetaTitle] = useState('JKLG Travel Agency | Explore Jammu, Kashmir, Ladakh, and Gurez');
  const [metaDescription, setMetaDescription] = useState('Discover the breathtaking beauty of Jammu, Kashmir, Ladakh, and Gurez with our expertly crafted tour packages. Create unforgettable memories with JKLG Travel Agency.');
  
  // Email Config
  const [fromName, setFromName] = useState('JKLG Travel');
  const [fromEmail, setFromEmail] = useState('bookings@jklgtravel.com');
  const [emailFooter, setEmailFooter] = useState('© 2025 JKLG Travel Agency. All rights reserved. 123 Tourism Road, Srinagar, Jammu & Kashmir, India');
  
  // SMTP Config
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('your-email@gmail.com');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpFromEmail, setSmtpFromEmail] = useState('noreply@jklgtravel.com');
  const [useTLS, setUseTLS] = useState(true);
  const [smtpEnabled, setSmtpEnabled] = useState(false);
  
  // UI Preferences
  const [theme, setTheme] = useState('light');
  const [layout, setLayout] = useState('compact');
  const [fontSize, setFontSize] = useState('medium');
  const [contrast, setContrast] = useState('normal');
  
  // Display Settings with Sliders
  const [displaySettings, setDisplaySettings] = useState({
    heroBrightness: 70,
    featureOpacity: 100,
    animationSpeed: 50
  });

  // Load settings from database on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Load general settings
      const { data: generalData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'general_settings')
        .single();
      
      if (generalData?.value) {
        setSiteName(generalData.value.siteName || 'JKLG Travel Agency');
        
        // Support both new (array) and old (single) formats
        if (Array.isArray(generalData.value.siteEmails)) {
          setSiteEmails(generalData.value.siteEmails);
        } else {
          setSiteEmails([generalData.value.siteEmail || 'info@jklgtravel.com']);
        }
        
        if (Array.isArray(generalData.value.sitePhones)) {
          setSitePhones(generalData.value.sitePhones);
        } else {
          setSitePhones([generalData.value.sitePhone || '+91 98765 43210']);
        }
        
        setSiteAddress(generalData.value.siteAddress || '123 Tourism Road, Srinagar, Jammu & Kashmir, India');
      }

      // Load social links
      const { data: socialData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'social_links')
        .single();
      
      if (socialData?.value) {
        setSocialLinks(socialData.value);
      }

      // Load display settings
      const { data: displayData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'display_settings')
        .single();
      
      if (displayData?.value) {
        setDisplaySettings(displayData.value);
      }

      // Load hero slides if stored
      const { data: heroData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_slides')
        .single();
      
      if (heroData?.value && Array.isArray(heroData.value) && heroData.value.length > 0) {
        setHeroSlides(heroData.value);
      }

      // Load SEO settings
      const { data: seoData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'seo_settings')
        .single();
      
      if (seoData?.value) {
        setMetaTitle(seoData.value.metaTitle || 'JKLG Travel Agency | Explore Jammu, Kashmir, Ladakh, and Gurez');
        setMetaDescription(seoData.value.metaDescription || 'Discover the breathtaking beauty of Jammu, Kashmir, Ladakh, and Gurez with our expertly crafted tour packages. Create unforgettable memories with JKLG Travel Agency.');
      }

      // Load email templates
      const { data: emailTemplatesData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'email_templates')
        .single();
      
      if (emailTemplatesData?.value && Array.isArray(emailTemplatesData.value)) {
        setEmailTemplates(emailTemplatesData.value);
      }

      // Load email config
      const { data: emailConfigData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'email_config')
        .single();
      
      if (emailConfigData?.value) {
        setFromName(emailConfigData.value.fromName || 'JKLG Travel');
        setFromEmail(emailConfigData.value.fromEmail || 'bookings@jklgtravel.com');
        setEmailFooter(emailConfigData.value.emailFooter || '© 2025 JKLG Travel Agency. All rights reserved. 123 Tourism Road, Srinagar, Jammu & Kashmir, India');
      }

      // Load SMTP config
      const { data: smtpData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'smtp_config')
        .single();
      
      if (smtpData?.value) {
        setSmtpHost(smtpData.value.smtpHost || 'smtp.gmail.com');
        setSmtpPort(smtpData.value.smtpPort || 587);
        setSmtpUser(smtpData.value.smtpUser || 'your-email@gmail.com');
        setSmtpPassword(smtpData.value.smtpPassword || '');
        setSmtpFromEmail(smtpData.value.smtpFromEmail || 'noreply@jklgtravel.com');
        setUseTLS(smtpData.value.useTLS !== false);
        setSmtpEnabled(smtpData.value.enabled || false);
      }

      // Load UI preferences
      const { data: uiData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'ui_preferences')
        .single();
      
      if (uiData?.value) {
        setTheme(uiData.value.theme || 'light');
        setLayout(uiData.value.layout || 'compact');
        setFontSize(uiData.value.fontSize || 'medium');
        setContrast(uiData.value.contrast || 'normal');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setSaveMessage('Saving...');

      // Save general settings
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'general_settings',
            value: { siteName, siteEmails, sitePhones, siteAddress }
          },
          { onConflict: 'key' }
        );

      // Save social links
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'social_links',
            value: socialLinks
          },
          { onConflict: 'key' }
        );

      // Save display settings
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'display_settings',
            value: displaySettings
          },
          { onConflict: 'key' }
        );

      // Save hero slides
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'hero_slides',
            value: heroSlides
          },
          { onConflict: 'key' }
        );

      // Save SEO settings
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'seo_settings',
            value: { metaTitle, metaDescription }
          },
          { onConflict: 'key' }
        );

      // Save email templates
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'email_templates',
            value: emailTemplates
          },
          { onConflict: 'key' }
        );

      // Save email config
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'email_config',
            value: { fromName, fromEmail, emailFooter }
          },
          { onConflict: 'key' }
        );

      // Save SMTP config
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'smtp_config',
            value: { smtpHost, smtpPort, smtpUser, smtpPassword, smtpFromEmail, useTLS, enabled: smtpEnabled }
          },
          { onConflict: 'key' }
        );

      // Save UI preferences
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'ui_preferences',
            value: { theme, layout, fontSize, contrast }
          },
          { onConflict: 'key' }
        );

      setSaveMessage('✅ Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('❌ Error saving settings');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
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
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-primary-600" size={32} />
          <span className="ml-2 text-gray-600">Loading settings...</span>
        </div>
      ) : (
      <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-gray-600">Manage and customize your travel agency website</p>
        </div>
        <div className="flex items-center gap-4">
          {saveMessage && (
            <div className="text-sm font-medium px-3 py-2 rounded-lg bg-blue-50 text-blue-800">
              {saveMessage}
            </div>
          )}
          <button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg inline-flex items-center"
          >
            {saving ? (
              <Loader size={18} className="animate-spin mr-2" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
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
            <button
              onClick={() => setActiveTab('smtp')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'smtp'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              SMTP Settings
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'display'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Display Settings
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
                
                {/* Email Addresses */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Addresses
                    </label>
                    <button 
                      onClick={() => setSiteEmails([...siteEmails, ''])}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm inline-flex items-center"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Email
                    </button>
                  </div>
                  <div className="space-y-2">
                    {siteEmails.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => {
                            const newEmails = [...siteEmails];
                            newEmails[index] = e.target.value;
                            setSiteEmails(newEmails);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="email@example.com"
                        />
                        {siteEmails.length > 1 && (
                          <button 
                            onClick={() => setSiteEmails(siteEmails.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-900 px-3 py-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Phone Numbers */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Numbers
                    </label>
                    <button 
                      onClick={() => setSitePhones([...sitePhones, ''])}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm inline-flex items-center"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Phone
                    </button>
                  </div>
                  <div className="space-y-2">
                    {sitePhones.map((phone, index) => (
                      <div key={index} className="flex gap-2">
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => {
                            const newPhones = [...sitePhones];
                            newPhones[index] = e.target.value;
                            setSitePhones(newPhones);
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="+91 9876543210"
                        />
                        {sitePhones.length > 1 && (
                          <button 
                            onClick={() => setSitePhones(sitePhones.filter((_, i) => i !== index))}
                            className="text-red-600 hover:text-red-900 px-3 py-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Office Address */}
                <div>
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
                
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Tip:</strong> You can add multiple phone numbers and email addresses. They will be displayed throughout the website including footer, contact page, and booking confirmations.
                  </p>
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
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
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
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
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
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
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
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
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
                      value={emailFooter}
                      onChange={(e) => setEmailFooter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Display Settings Tab */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4">Display Settings</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-8">
                
                {/* Hero Image Brightness Slider */}
                <div>
                  <label htmlFor="brightness" className="block text-sm font-medium text-gray-700 mb-3">
                    Hero Section Brightness
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      id="brightness"
                      type="range"
                      min="0"
                      max="100"
                      value={displaySettings.heroBrightness}
                      onChange={(e) => setDisplaySettings({...displaySettings, heroBrightness: parseInt(e.target.value)})}
                      className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="w-16 text-center">
                      <span className="text-sm font-medium text-gray-900">{displaySettings.heroBrightness}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Adjust how bright or dark the hero section appears. 0% is completely dark, 100% is normal brightness.
                  </p>
                </div>
                
                {/* Feature Section Opacity Slider */}
                <div>
                  <label htmlFor="opacity" className="block text-sm font-medium text-gray-700 mb-3">
                    Feature Cards Opacity
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      id="opacity"
                      type="range"
                      min="0"
                      max="100"
                      value={displaySettings.featureOpacity}
                      onChange={(e) => setDisplaySettings({...displaySettings, featureOpacity: parseInt(e.target.value)})}
                      className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="w-16 text-center">
                      <span className="text-sm font-medium text-gray-900">{displaySettings.featureOpacity}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Control the transparency of feature cards. 0% is invisible, 100% is fully opaque.
                  </p>
                </div>
                
                {/* Animation Speed Slider */}
                <div>
                  <label htmlFor="animation" className="block text-sm font-medium text-gray-700 mb-3">
                    Animation Speed
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      id="animation"
                      type="range"
                      min="0"
                      max="100"
                      value={displaySettings.animationSpeed}
                      onChange={(e) => setDisplaySettings({...displaySettings, animationSpeed: parseInt(e.target.value)})}
                      className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="w-16 text-center">
                      <span className="text-sm font-medium text-gray-900">{displaySettings.animationSpeed}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Adjust animation speed from slow (0%) to fast (100%).
                  </p>
                </div>
                
                {/* Live Preview */}
                <div className="border-t border-gray-300 pt-6 mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h3>
                  <div 
                    className="w-full h-32 rounded-lg border-2 border-gray-300 bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden"
                    style={{ opacity: displaySettings.featureOpacity / 100 }}
                  >
                    <div className="text-center">
                      <p className="text-white text-sm font-medium">Hero Section Preview</p>
                      <p className="text-white/80 text-xs">Brightness: {displaySettings.heroBrightness}%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Display Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                    Default Theme
                  </label>
                  <select 
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="layout" className="block text-sm font-medium text-gray-700 mb-2">
                    Default Layout
                  </label>
                  <select 
                    id="layout"
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="compact">Compact</option>
                    <option value="comfortable">Comfortable</option>
                    <option value="spacious">Spacious</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="fontsize" className="block text-sm font-medium text-gray-700 mb-2">
                    Default Font Size
                  </label>
                  <select 
                    id="fontsize"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="contrast" className="block text-sm font-medium text-gray-700 mb-2">
                    Contrast Level
                  </label>
                  <select 
                    id="contrast"
                    value={contrast}
                    onChange={(e) => setContrast(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="maximum">Maximum</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* SMTP Settings Tab */}
          {activeTab === 'smtp' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium mb-4">SMTP Configuration</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* SMTP Host */}
                  <div>
                    <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Host
                    </label>
                    <input
                      id="smtpHost"
                      type="text"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="e.g., smtp.gmail.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">The SMTP server hostname</p>
                  </div>
                  
                  {/* SMTP Port */}
                  <div>
                    <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Port
                    </label>
                    <input
                      id="smtpPort"
                      type="number"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(parseInt(e.target.value))}
                      min="1"
                      max="65535"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Usually 25, 465 (SSL), or 587 (TLS)</p>
                  </div>
                  
                  {/* SMTP Username */}
                  <div>
                    <label htmlFor="smtpUser" className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Username
                    </label>
                    <input
                      id="smtpUser"
                      type="text"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="e.g., your-email@gmail.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email account for SMTP authentication</p>
                  </div>
                  
                  {/* SMTP Password */}
                  <div>
                    <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Password
                    </label>
                    <input
                      id="smtpPassword"
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      placeholder="Enter SMTP password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Password or app-specific password</p>
                  </div>
                  
                  {/* From Email */}
                  <div className="md:col-span-2">
                    <label htmlFor="smtpFromEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      From Email Address
                    </label>
                    <input
                      id="smtpFromEmail"
                      type="email"
                      value={smtpFromEmail}
                      onChange={(e) => setSmtpFromEmail(e.target.value)}
                      placeholder="e.g., noreply@jklgtravel.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email address that appears as sender</p>
                  </div>
                  
                  {/* TLS/SSL Toggle */}
                  <div className="flex items-center space-x-4">
                    <label htmlFor="useTLS" className="flex items-center cursor-pointer">
                      <input
                        id="useTLS"
                        type="checkbox"
                        checked={useTLS}
                        onChange={(e) => setUseTLS(e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">Use TLS/SSL</span>
                    </label>
                    <p className="text-xs text-gray-500">Enable encryption for connection</p>
                  </div>
                  
                  {/* Enable SMTP Toggle */}
                  <div className="flex items-center space-x-4">
                    <label htmlFor="smtpEnabled" className="flex items-center cursor-pointer">
                      <input
                        id="smtpEnabled"
                        type="checkbox"
                        checked={smtpEnabled}
                        onChange={(e) => setSmtpEnabled(e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">Enable SMTP</span>
                    </label>
                    <p className="text-xs text-gray-500">Activate email sending via SMTP</p>
                  </div>
                </div>
                
                {/* Security Warning */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>⚠️ Security Note:</strong> Store SMTP passwords securely. For Gmail, use an <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900">App Password</a> instead of your main password.
                  </p>
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
      </>
      )}
    </div>
  );
};

export default SettingsPage;