import React, { useEffect } from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import FeaturedDestinations from '../components/home/FeaturedDestinations';
import PopularPackages from '../components/home/PopularPackages';
import StatsCounter from '../components/home/StatsCounter';
import GalleryPreview from '../components/home/GalleryPreview';
import TestimonialSlider from '../components/home/TestimonialSlider';
import CtaSection from '../components/home/CtaSection';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'JKLG Travel Agency | Explore Jammu, Kashmir, Ladakh, and Gurez';
  }, []);

  return (
    <div>
      <HeroCarousel />
      <FeaturedDestinations />
      <PopularPackages />
      <StatsCounter />
      <GalleryPreview />
      <TestimonialSlider />
      <CtaSection />
    </div>
  );
};

export default HomePage;