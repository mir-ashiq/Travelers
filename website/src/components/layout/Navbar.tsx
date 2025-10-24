import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
  }`;

  const linkClasses = `text-sm font-medium transition-colors duration-200 ${
    scrolled ? 'text-gray-800 hover:text-primary-600' : 'text-white hover:text-white/80'
  }`;

  const activeLinkClasses = `${
    scrolled ? 'text-primary-600' : 'text-white font-semibold'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
            scrolled ? 'bg-primary-600' : 'bg-white'
          }`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={scrolled ? "white" : "#3B82F6"}
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
          <span className={`ml-2 font-heading font-bold text-xl ${
            scrolled ? 'text-gray-800' : 'text-white'
          }`}>
            JKLG Travel
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/destinations" 
            className={({ isActive }) => 
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            Destinations
          </NavLink>
          <NavLink 
            to="/packages" 
            className={({ isActive }) => 
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            Packages
          </NavLink>
          <NavLink 
            to="/gallery" 
            className={({ isActive }) => 
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            Gallery
          </NavLink>
          <NavLink 
            to="/testimonials" 
            className={({ isActive }) => 
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            Testimonials
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            About
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              isActive ? `${linkClasses} ${activeLinkClasses}` : linkClasses
            }
          >
            Contact
          </NavLink>
          
          <div className="relative group">
            <button className={`flex items-center ${linkClasses}`}>
              <Globe size={16} className="mr-1" />
              <span>EN</span>
              <ChevronDown size={16} className="ml-1" />
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
              <div className="py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hindi</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Urdu</a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className={scrolled ? "text-gray-800" : "text-white"} size={24} />
          ) : (
            <Menu className={scrolled ? "text-gray-800" : "text-white"} size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900 bg-opacity-95 flex flex-col pt-20 px-8 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "transform translate-x-0" : "transform translate-x-full"
        }`}
      >
        <NavLink 
          to="/" 
          className="text-white text-lg font-medium py-4 border-b border-gray-700"
          onClick={closeMenu}
        >
          Home
        </NavLink>
        <NavLink 
          to="/destinations" 
          className="text-white text-lg font-medium py-4 border-b border-gray-700"
          onClick={closeMenu}
        >
          Destinations
        </NavLink>
        <NavLink 
          to="/packages" 
          className="text-white text-lg font-medium py-4 border-b border-gray-700"
          onClick={closeMenu}
        >
          Packages
        </NavLink>
        <NavLink 
          to="/gallery" 
          className="text-white text-lg font-medium py-4 border-b border-gray-700"
          onClick={closeMenu}
        >
          Gallery
        </NavLink>
        <NavLink 
          to="/testimonials" 
          className="text-white text-lg font-medium py-4 border-b border-gray-700"
          onClick={closeMenu}
        >
          Testimonials
        </NavLink>
        <NavLink 
          to="/about" 
          className="text-white text-lg font-medium py-4 border-b border-gray-700"
          onClick={closeMenu}
        >
          About
        </NavLink>
        <NavLink 
          to="/contact" 
          className="text-white text-lg font-medium py-4 border-b border-gray-700"
          onClick={closeMenu}
        >
          Contact
        </NavLink>

        <div className="mt-8 flex space-x-4">
          <button className="text-white flex items-center">
            <Globe size={20} className="mr-2" />
            English
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;