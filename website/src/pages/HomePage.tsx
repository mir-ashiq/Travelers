import { useEffect } from 'react';
import AnimatedHeroCarousel from '../components/home/AnimatedHeroCarousel';
import FeaturedDestinations from '../components/home/FeaturedDestinations';
import PopularPackages from '../components/home/PopularPackages';
import StatsCounter from '../components/home/StatsCounter';
import GalleryPreview from '../components/home/GalleryPreview';
import AnimatedTestimonialSlider from '../components/home/AnimatedTestimonialSlider';
import CtaSection from '../components/home/CtaSection';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'JKLG Travel Agency | Explore Jammu, Kashmir, Ladakh, and Gurez';
  }, []);

  return (
    <div>
      <AnimatedHeroCarousel />
      <FeaturedDestinations />
      <PopularPackages />
      <StatsCounter />
      <GalleryPreview />
      <AnimatedTestimonialSlider />
      <CtaSection />
    </div>
  );
};

export default HomePage;