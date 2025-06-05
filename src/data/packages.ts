export interface TourPackage {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  destinations: string[];
  featured: boolean;
  rating: number;
  accommodations: string;
  included: string[];
  excluded: string[];
  itinerary: {
    day: number;
    title: string;
    description: string;
  }[];
}

export const packages: TourPackage[] = [
  {
    id: 1,
    title: 'Kashmir Bliss: 6 Days Tour',
    description: 'Experience the pristine beauty of Kashmir with visits to Srinagar, Gulmarg, and Pahalgam. Enjoy shikara rides, stunning gardens, and snow-capped mountains.',
    price: 24999,
    duration: 6,
    image: 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    destinations: ['Srinagar', 'Gulmarg', 'Pahalgam'],
    featured: true,
    rating: 4.8,
    accommodations: 'Luxury houseboats and 4-star hotels',
    included: [
      'Airport transfers',
      'Accommodation',
      'Daily breakfast and dinner',
      'Sightseeing as per itinerary',
      'English-speaking guide',
      'All applicable taxes'
    ],
    excluded: [
      'Airfare',
      'Lunch',
      'Personal expenses',
      'Travel insurance',
      'Optional activities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar',
        description: 'Arrive at Srinagar Airport and transfer to your houseboat on Dal Lake. Enjoy a relaxing shikara ride in the evening.'
      },
      {
        day: 2,
        title: 'Srinagar City Tour',
        description: 'Visit Mughal Gardens, Shankaracharya Temple, and local markets. Enjoy another night on the houseboat.'
      },
      {
        day: 3,
        title: 'Gulmarg Excursion',
        description: 'Full-day excursion to Gulmarg. Enjoy the Gondola ride (optional) and panoramic views of the Himalayas.'
      },
      {
        day: 4,
        title: 'Pahalgam Visit',
        description: 'Drive to Pahalgam, visiting Avantipura ruins and saffron fields en route. Check-in at hotel in Pahalgam.'
      },
      {
        day: 5,
        title: 'Pahalgam Exploration',
        description: 'Explore the beautiful valleys of Aru, Betaab, and Chandanwari (subject to weather conditions).'
      },
      {
        day: 6,
        title: 'Departure',
        description: 'Return to Srinagar and transfer to the airport for your departure flight.'
      }
    ]
  },
  {
    id: 2,
    title: 'Ladakh Adventure: 8 Days Tour',
    description: 'Embark on an adventure through the stunning landscapes of Ladakh. Visit Leh, Nubra Valley, Pangong Lake, and more.',
    price: 34999,
    duration: 8,
    image: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    destinations: ['Leh', 'Nubra Valley', 'Pangong Lake', 'Khardung La'],
    featured: true,
    rating: 4.9,
    accommodations: '3-star hotels and luxury camps',
    included: [
      'Airport transfers',
      'Accommodation',
      'All meals',
      'Sightseeing as per itinerary',
      'Inner Line Permits',
      'English-speaking guide',
      'All applicable taxes'
    ],
    excluded: [
      'Airfare',
      'Personal expenses',
      'Travel insurance',
      'Optional activities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh',
        description: 'Arrive at Leh Airport and transfer to your hotel. Rest for acclimatization.'
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing',
        description: 'Visit Shanti Stupa, Leh Palace, and Namgyal Tsemo Monastery.'
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley',
        description: 'Drive to Nubra Valley via Khardung La (one of the highest motorable roads). Visit Diskit Monastery and Hunder sand dunes.'
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Lake',
        description: 'Drive to Pangong Lake via Shyok river route. Enjoy the mesmerizing views of the changing colors of the lake.'
      },
      {
        day: 5,
        title: 'Pangong Lake to Leh',
        description: 'Return to Leh via Chang La pass, visiting Thiksey Monastery en route.'
      },
      {
        day: 6,
        title: 'Excursion to Alchi and Lamayuru',
        description: 'Day trip to Alchi and Lamayuru monasteries, some of the oldest in Ladakh.'
      },
      {
        day: 7,
        title: 'Leh Leisure Day',
        description: 'Free day for shopping and relaxation in Leh.'
      },
      {
        day: 8,
        title: 'Departure',
        description: 'Transfer to Leh Airport for your departure flight.'
      }
    ]
  },
  {
    id: 3,
    title: 'Gurez Valley Explorer: 5 Days Tour',
    description: 'Discover the untouched beauty of Gurez Valley, one of Kashmir\'s hidden gems with pristine landscapes and rich culture.',
    price: 22999,
    duration: 5,
    image: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    destinations: ['Srinagar', 'Gurez Valley', 'Dawar'],
    featured: true,
    rating: 4.7,
    accommodations: '3-star hotels and guesthouses',
    included: [
      'Airport transfers',
      'Accommodation',
      'All meals',
      'Sightseeing as per itinerary',
      'Permits',
      'English-speaking guide',
      'All applicable taxes'
    ],
    excluded: [
      'Airfare',
      'Personal expenses',
      'Travel insurance',
      'Optional activities'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar',
        description: 'Arrive at Srinagar Airport and transfer to your hotel. Evening at leisure.'
      },
      {
        day: 2,
        title: 'Srinagar to Gurez Valley',
        description: 'Drive to Gurez Valley via Razdan Pass. Check-in at guesthouse in Dawar.'
      },
      {
        day: 3,
        title: 'Exploring Gurez Valley',
        description: 'Visit Habba Khatoon Peak, Tulail Valley, and traditional Dard-Shin villages.'
      },
      {
        day: 4,
        title: 'Gurez to Srinagar',
        description: 'Return to Srinagar. Evening at leisure for shopping.'
      },
      {
        day: 5,
        title: 'Departure',
        description: 'Transfer to Srinagar Airport for your departure flight.'
      }
    ]
  },
  {
    id: 4,
    title: 'Jammu Heritage Tour: 4 Days',
    description: 'Explore the rich cultural heritage of Jammu with visits to temples, palaces, and natural wonders.',
    price: 18999,
    duration: 4,
    image: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    destinations: ['Jammu', 'Vaishno Devi', 'Patnitop'],
    featured: true,
    rating: 4.6,
    accommodations: '3-star and 4-star hotels',
    included: [
      'Airport transfers',
      'Accommodation',
      'Daily breakfast',
      'Sightseeing as per itinerary',
      'English-speaking guide',
      'All applicable taxes'
    ],
    excluded: [
      'Airfare',
      'Lunch and dinner',
      'Personal expenses',
      'Travel insurance',
      'Optional activities',
      'Helicopter tickets for Vaishno Devi'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Jammu',
        description: 'Arrive at Jammu Airport and transfer to your hotel. Visit Raghunath Temple and Bahu Fort.'
      },
      {
        day: 2,
        title: 'Jammu to Katra',
        description: 'Drive to Katra, the base for Vaishno Devi pilgrimage. Check-in at hotel and prepare for the trek.'
      },
      {
        day: 3,
        title: 'Vaishno Devi Darshan',
        description: 'Early morning trek to Vaishno Devi Temple (optional helicopter service available). Return to Katra in evening.'
      },
      {
        day: 4,
        title: 'Departure',
        description: 'Return to Jammu and transfer to the airport for your departure flight.'
      }
    ]
  }
];