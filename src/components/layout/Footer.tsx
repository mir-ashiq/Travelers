import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Clock 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3B82F6"
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
              <span className="ml-2 font-heading font-bold text-xl">JKLG Travel</span>
            </div>
            <p className="text-gray-400 mb-4">
              Discover the breathtaking beauty of Jammu, Kashmir, Ladakh, and Gurez with our expertly crafted tour packages.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" className="hover:text-primary-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-gray-400 hover:text-white transition-colors">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-gray-400 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Dal Lake, Srinagar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Gulmarg
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Pangong Lake, Ladakh
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Nubra Valley
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Gurez Valley
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Vaishno Devi, Jammu
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin size={20} className="mr-3 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400">
                  123 Tourism Road, Srinagar, Jammu & Kashmir, India
                </span>
              </li>
              <li className="flex">
                <Phone size={20} className="mr-3 text-primary-400 flex-shrink-0" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex">
                <Mail size={20} className="mr-3 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@jklgtravel.com" className="text-gray-400 hover:text-white transition-colors">
                  info@jklgtravel.com
                </a>
              </li>
              <li className="flex">
                <Clock size={20} className="mr-3 text-primary-400 flex-shrink-0" />
                <span className="text-gray-400">
                  Mon-Sat: 9:00 AM - 7:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} JKLG Travel Agency. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm text-gray-500">
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;