export interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  message: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Delhi, India',
    rating: 5,
    message: 'Our trip to Kashmir was absolutely magical! The houseboat stay on Dal Lake was an unforgettable experience. The team at JKLG Travel took care of everything and made our honeymoon truly special.'
  },
  {
    id: 2,
    name: 'James Wilson',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'London, UK',
    rating: 5,
    message: 'Ladakh was on my bucket list for years, and JKLG Travel made it happen perfectly. The itinerary was well-planned, accommodations were comfortable, and our guide was incredibly knowledgeable. Pangong Lake was even more beautiful than in pictures!'
  },
  {
    id: 3,
    name: 'Aisha Khan',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Mumbai, India',
    rating: 4,
    message: 'We took the Gurez Valley Explorer tour and were blown away by the untouched beauty of the region. It felt like we had discovered a hidden paradise. Thank you for introducing us to this lesser-known gem!'
  },
  {
    id: 4,
    name: 'David Chen',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Singapore',
    rating: 5,
    message: 'The Kashmir Bliss tour exceeded all our expectations. From the moment we landed until departure, everything was perfectly arranged. The Mughal Gardens were stunning, and the shikara ride on Dal Lake was so peaceful. Highly recommend!'
  },
  {
    id: 5,
    name: 'Neha Patel',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Ahmedabad, India',
    rating: 4,
    message: 'Our family trip to Jammu and Vaishno Devi was a beautiful spiritual experience. The hotel arrangements were excellent, and our guide was very helpful. The only suggestion would be to include more meal options in the package.'
  },
  {
    id: 6,
    name: 'Michael Thompson',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    location: 'Sydney, Australia',
    rating: 5,
    message: 'As a photographer, the landscapes of Ladakh were a dream come true. Our guide knew exactly where to take us for the best shots at the perfect time of day. The team was flexible with our schedule and accommodated all our requests.'
  }
];