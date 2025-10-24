import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { Users, MapPin, Compass, Star } from 'lucide-react';

const stats = [
  {
    id: 1,
    value: 10000,
    label: 'Happy Travelers',
    icon: Users,
    color: 'bg-primary-100 text-primary-600'
  },
  {
    id: 2,
    value: 50,
    label: 'Destinations',
    icon: MapPin,
    color: 'bg-secondary-100 text-secondary-600'
  },
  {
    id: 3,
    value: 100,
    label: 'Tour Packages',
    icon: Compass,
    color: 'bg-accent-100 text-accent-600'
  },
  {
    id: 4,
    value: 98,
    label: 'Satisfaction Rate',
    suffix: '%',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600'
  }
];

const StatsCounter = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(stat => {
            const Icon = stat.icon;
            
            return (
              <div key={stat.id} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className={`w-16 h-16 mx-auto rounded-full ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon size={32} />
                </div>
                <div className="text-3xl md:text-4xl font-bold font-heading mb-2">
                  {inView ? (
                    <CountUp 
                      end={stat.value} 
                      duration={2.5} 
                      suffix={stat.suffix || ''} 
                    />
                  ) : (
                    '0'
                  )}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;