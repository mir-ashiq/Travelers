import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact Us | JKLG Travel Agency';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create a support ticket
      const { data: ticketData, error } = await supabase
        .from('support_tickets')
        .insert([{
          subject: formData.subject,
          customer: formData.name,
          email: formData.email,
          status: 'Open',
          priority: 'Medium', // Default priority
          category: 'Information', // Default category
          assigned_to: null,
          last_update: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;

      const ticketId = ticketData?.[0]?.id;
      
      // TODO: Send emails via backend service or scheduled job
      // For now, just show success message
      console.log('Support ticket created with ID:', ticketId);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      toast.success('Your message has been sent! We will get back to you soon.');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-24 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/2105833/pexels-photo-2105833.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Have questions or need assistance? We're here to help you plan your perfect journey
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Address</h3>
              <p className="text-gray-600">
                123 Tourism Road, Srinagar<br />
                Jammu & Kashmir, India
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center mb-4">
                <Phone size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">
                <a href="tel:+919876543210" className="hover:text-primary-600 transition">
                  +91 98765 43210
                </a>
                <br />
                <a href="tel:+919876543211" className="hover:text-primary-600 transition">
                  +91 98765 43211
                </a>
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent-100 text-accent-600 flex items-center justify-center mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">
                <a href="mailto:info@jklgtravel.com" className="hover:text-primary-600 transition">
                  info@jklgtravel.com
                </a>
                <br />
                <a href="mailto:bookings@jklgtravel.com" className="hover:text-primary-600 transition">
                  bookings@jklgtravel.com
                </a>
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Office Hours</h3>
              <p className="text-gray-600">
                Monday - Saturday<br />
                9:00 AM - 7:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form & Map Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Have questions about our tour packages or need personalized recommendations? Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject"
                      placeholder="Subject of your message"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    placeholder="Your message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 disabled:bg-primary-400 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={20} className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="font-bold text-lg mb-2 flex items-start">
                    <MessageSquare size={20} className="text-primary-600 mr-2 mt-1" />
                    What is the best time to visit Kashmir?
                  </h3>
                  <p className="text-gray-600">
                    The best time to visit Kashmir is from April to October. Spring (April to June) offers blooming gardens, summer (July to August) has pleasant weather, and autumn (September to October) showcases golden landscapes.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="font-bold text-lg mb-2 flex items-start">
                    <MessageSquare size={20} className="text-primary-600 mr-2 mt-1" />
                    Do I need special permits for Ladakh?
                  </h3>
                  <p className="text-gray-600">
                    Yes, certain areas in Ladakh require Inner Line Permits (ILP). Our tour packages include obtaining these permits for you, so you don't need to worry about the process.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="font-bold text-lg mb-2 flex items-start">
                    <MessageSquare size={20} className="text-primary-600 mr-2 mt-1" />
                    How do I book a tour package?
                  </h3>
                  <p className="text-gray-600">
                    You can book a tour package by filling out the booking form on the package detail page or by contacting us directly via phone or email. No advance payment is required for booking.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="font-bold text-lg mb-2 flex items-start">
                    <MessageSquare size={20} className="text-primary-600 mr-2 mt-1" />
                    Do you offer customized tour packages?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we offer customized tour packages tailored to your preferences, budget, and time constraints. Contact us with your requirements, and we'll create a personalized itinerary for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;