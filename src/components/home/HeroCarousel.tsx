import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/1486520/pexels-photo-1486520.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Discover Paradise on Earth',
    subtitle: 'Experience the breathtaking beauty of Kashmir',
    cta: 'Explore Packages',
    link: '/packages'
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/5583514/pexels-photo-5583514.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Adventure Awaits in Ladakh',
    subtitle: 'Journey through the roof of the world',
    cta: 'View Destinations',
    link: '/destinations'
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/2105833/pexels-photo-2105833.jpeg?auto=compress&cs=tinysrgb&w=1920',
    title: 'Discover Hidden Gems',
    subtitle: 'Explore the untouched beauty of Gurez Valley',
    cta: 'Book Now',
    link: '/packages'
  }
];

const HeroCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    fade: true,
    arrows: false
  };

  return (
    <div className="relative">
      <Slider {...settings}>
        {slides.map(slide => (
          <div key={slide.id} className="relative hero-slide">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
            <div className="container relative h-full flex flex-col justify-center items-start px-8 md:px-16">
              <h1 className="text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 text-shadow animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-white text-xl md:text-2xl max-w-2xl mb-8 text-shadow animate-slide-up">
                {slide.subtitle}
              </p>
              <Link
                to={slide.link}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-full transition duration-300 inline-flex items-center animate-slide-up"
              >
                {slide.cta}
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;