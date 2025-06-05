import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Compass, Shield, LifeBuoy, Star } from 'lucide-react';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About Us | JKLG Travel Agency';
  }, []);

  const teamMembers = [
    {
      name: 'Aarav Sharma',
      position: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120',
      bio: 'A native of Kashmir with over 15 years of experience in the travel industry. Passionate about showcasing the beauty of the region to the world.'
    },
    {
      name: 'Priya Kaul',
      position: 'Operations Manager',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120',
      bio: 'Handles the day-to-day operations and ensures all tours run smoothly. Expert in creating memorable guest experiences.'
    },
    {
      name: 'Raj Gupta',
      position: 'Lead Tour Guide',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120',
      bio: 'Born and raised in Ladakh, Raj brings local knowledge and storytelling to all our expeditions. Certified mountaineer and wilderness first responder.'
    },
    {
      name: 'Zara Khan',
      position: 'Customer Relations',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120',
      bio: 'Dedicated to ensuring every traveler has a seamless experience from booking to return. Known for her attention to detail and personalized service.'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative py-24 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/13580526/pexels-photo-13580526.jpeg?auto=compress&cs=tinysrgb&w=1920)' }}
        ></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About JKLG Travel
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your gateway to unforgettable adventures in Jammu, Kashmir, Ladakh, and Gurez
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2010, JKLG Travel Agency began with a simple mission: to share the breathtaking beauty and rich cultural heritage of Jammu, Kashmir, Ladakh, and Gurez with travelers from around the world.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                As natives of these regions, our founders grew up surrounded by snow-capped mountains, crystal-clear lakes, and vibrant traditions. They recognized that while many tourists visited the well-known spots, few experienced the authentic essence and hidden gems of these diverse landscapes.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                What started as a small operation with just two guides has now grown into a trusted travel partner for thousands of travelers each year. Despite our growth, we maintain our commitment to sustainable tourism, supporting local communities, and providing personalized experiences that create lasting memories.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/packages" 
                  className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-5 rounded-lg transition duration-300"
                >
                  Explore Our Packages
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-5 rounded-lg transition duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Kashmir landscape" 
                  className="rounded-lg h-48 w-full object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Ladakh landscape" 
                  className="rounded-lg h-64 w-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <img 
                  src="https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Jammu landscape" 
                  className="rounded-lg h-64 w-full object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Gurez landscape" 
                  className="rounded-lg h-48 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              The principles that guide us in creating exceptional travel experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Customer-Centric</h3>
              <p className="text-gray-600">
                We put our travelers first in everything we do, from customized itineraries to responsive customer service before, during, and after your journey.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center text-secondary-600 mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every detail, from selecting the best accommodations to training our guides to provide exceptional service.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-accent-100 rounded-lg flex items-center justify-center text-accent-600 mb-6">
                <Compass size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Authenticity</h3>
              <p className="text-gray-600">
                We showcase the true essence of each destination, moving beyond tourist hotspots to provide genuine cultural experiences and local interactions.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-6">
                <LifeBuoy size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We promote responsible tourism that preserves natural environments, supports local communities, and minimizes our ecological footprint.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                <Star size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We constantly explore new destinations, create unique experiences, and improve our services to exceed traveler expectations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Safety</h3>
              <p className="text-gray-600">
                We prioritize the safety and security of our travelers with thorough planning, well-trained guides, and comprehensive emergency protocols.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our passionate team of travel experts is dedicated to creating unforgettable experiences
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-primary-600 mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Your Adventure Today
            </h2>
            <p className="text-gray-200 text-lg mb-8">
              Join thousands of satisfied travelers who have experienced the magic of Jammu, Kashmir, Ladakh, and Gurez with us.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/packages" 
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center justify-center"
              >
                Explore Packages
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link 
                to="/contact" 
                className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-medium py-3 px-8 rounded-lg transition duration-300 inline-flex items-center justify-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;