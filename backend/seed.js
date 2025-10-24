#!/usr/bin/env node

/**
 * Database Seeding Script for JKLG Travel Agency
 * 
 * This script seeds the Supabase database with sample data including:
 * - Destinations
 * - Tour Packages
 * - Itineraries
 * - Gallery Images
 * - Testimonials
 * - Admin Users
 * - Bookings
 * - Support Tickets
 * - FAQs
 * - Blog Posts
 * 
 * Usage:
 *   node seed.js              # Seeds with default data
 *   node seed.js --reset      # Clears and reseeds all data
 *   node seed.js --fresh      # Fresh install (recommended first time)
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(chalk.red('❌ Error: Missing Supabase credentials'));
  console.error(chalk.yellow('Please ensure .env file has VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY'));
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const seedData = {
  destinations: [
    {
      name: 'Dal Lake',
      region: 'Kashmir',
      description: 'Known as the "Jewel in the crown of Kashmir", Dal Lake is famous for its houseboats and floating gardens.',
      image: 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: true,
    },
    {
      name: 'Gulmarg',
      region: 'Kashmir',
      description: 'A premier ski destination with breathtaking meadows, Gulmarg offers stunning views of snow-capped mountains.',
      image: 'https://images.pexels.com/photos/4254554/pexels-photo-4254554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: true,
    },
    {
      name: 'Pangong Lake',
      region: 'Ladakh',
      description: 'This stunning high-altitude lake changes colors throughout the day and is surrounded by barren mountains.',
      image: 'https://images.pexels.com/photos/37057/scooter-india-nomad-landscape.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: true,
    },
    {
      name: 'Nubra Valley',
      region: 'Ladakh',
      description: 'Known for its orchards, rare double-humped camels and dramatic landscapes.',
      image: 'https://images.pexels.com/photos/9726393/pexels-photo-9726393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: true,
    },
    {
      name: 'Gurez Valley',
      region: 'Gurez',
      description: 'A remote and untouched valley with pristine beauty, traditional villages, and stunning mountain views.',
      image: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: true,
    },
    {
      name: 'Vaishno Devi',
      region: 'Jammu',
      description: 'One of the most revered Hindu pilgrimage sites, nestled in the Trikuta Mountains.',
      image: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: true,
    },
    {
      name: 'Sonamarg',
      region: 'Kashmir',
      description: 'Meaning "Meadow of Gold", Sonamarg offers breathtaking vistas of snow-clad mountains and glaciers.',
      image: 'https://images.pexels.com/photos/12918978/pexels-photo-12918978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: false,
    },
    {
      name: 'Leh Palace',
      region: 'Ladakh',
      description: 'A former royal palace with a striking resemblance to the Potala Palace in Tibet.',
      image: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: false,
    },
  ],

  packages: [
    {
      title: 'Kashmir Bliss: 6 Days Tour',
      description: 'Experience the pristine beauty of Kashmir with visits to Srinagar, Gulmarg, and Pahalgam. Enjoy shikara rides, stunning gardens, and snow-capped mountains.',
      price: 24999,
      duration: 6,
      image: 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      destinations: ['Srinagar', 'Gulmarg', 'Pahalgam'],
      featured: true,
      rating: 4.8,
      accommodations: 'Luxury houseboats and 4-star hotels',
      included: ['Airport transfers', 'Accommodation', 'Daily breakfast and dinner', 'Sightseeing as per itinerary', 'English-speaking guide', 'All applicable taxes'],
      excluded: ['Airfare', 'Lunch', 'Personal expenses', 'Travel insurance', 'Optional activities'],
    },
    {
      title: 'Ladakh Adventure: 8 Days Tour',
      description: 'Embark on an adventure through the stunning landscapes of Ladakh. Visit Leh, Nubra Valley, Pangong Lake, and more.',
      price: 34999,
      duration: 8,
      image: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      destinations: ['Leh', 'Nubra Valley', 'Pangong Lake', 'Khardung La'],
      featured: true,
      rating: 4.9,
      accommodations: '3-star hotels and luxury camps',
      included: ['Airport transfers', 'Accommodation', 'All meals', 'Sightseeing as per itinerary', 'Inner Line Permits', 'English-speaking guide', 'All applicable taxes'],
      excluded: ['Airfare', 'Personal expenses', 'Travel insurance', 'Optional activities'],
    },
    {
      title: 'Gurez Valley Explorer: 5 Days Tour',
      description: 'Discover the untouched beauty of Gurez Valley, one of Kashmir\'s hidden gems with pristine landscapes and rich culture.',
      price: 22999,
      duration: 5,
      image: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      destinations: ['Srinagar', 'Gurez Valley', 'Dawar'],
      featured: true,
      rating: 4.7,
      accommodations: '3-star hotels and guesthouses',
      included: ['Airport transfers', 'Accommodation', 'All meals', 'Sightseeing as per itinerary', 'Permits', 'English-speaking guide', 'All applicable taxes'],
      excluded: ['Airfare', 'Personal expenses', 'Travel insurance', 'Optional activities'],
    },
    {
      title: 'Jammu Heritage Tour: 4 Days',
      description: 'Explore the rich cultural heritage of Jammu with visits to temples, palaces, and natural wonders.',
      price: 18999,
      duration: 4,
      image: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      destinations: ['Jammu', 'Vaishno Devi', 'Patnitop'],
      featured: true,
      rating: 4.6,
      accommodations: '3-star and 4-star hotels',
      included: ['Airport transfers', 'Accommodation', 'Daily breakfast', 'Sightseeing as per itinerary', 'English-speaking guide', 'All applicable taxes'],
      excluded: ['Airfare', 'Lunch and dinner', 'Personal expenses', 'Travel insurance', 'Optional activities', 'Helicopter tickets for Vaishno Devi'],
    },
  ],

  testimonials: [
    {
      name: 'Priya Sharma',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Delhi, India',
      rating: 5,
      message: 'Our trip to Kashmir was absolutely magical! The houseboat stay on Dal Lake was an unforgettable experience. The team at JKLG Travel took care of everything and made our honeymoon truly special.',
      status: 'published',
      date: '2025-05-15',
    },
    {
      name: 'James Wilson',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'London, UK',
      rating: 5,
      message: 'Ladakh was on my bucket list for years, and JKLG Travel made it happen perfectly. The itinerary was well-planned, accommodations were comfortable, and our guide was incredibly knowledgeable. Pangong Lake was even more beautiful than in pictures!',
      status: 'published',
      date: '2025-05-10',
    },
    {
      name: 'Aisha Khan',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Mumbai, India',
      rating: 4,
      message: 'We took the Gurez Valley Explorer tour and were blown away by the untouched beauty of the region. It felt like we had discovered a hidden paradise. Thank you for introducing us to this lesser-known gem!',
      status: 'published',
      date: '2025-05-02',
    },
    {
      name: 'David Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Singapore',
      rating: 5,
      message: 'The Kashmir Bliss tour exceeded all our expectations. From the moment we landed until departure, everything was perfectly arranged. The Mughal Gardens were stunning, and the shikara ride on Dal Lake was so peaceful. Highly recommend!',
      status: 'published',
      date: '2025-04-28',
    },
    {
      name: 'Neha Patel',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Ahmedabad, India',
      rating: 4,
      message: 'Our family trip to Jammu and Vaishno Devi was a beautiful spiritual experience. The hotel arrangements were excellent, and our guide was very helpful. The only suggestion would be to include more meal options in the package.',
      status: 'published',
      date: '2025-04-20',
    },
    {
      name: 'Michael Thompson',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Sydney, Australia',
      rating: 5,
      message: 'As a photographer, the landscapes of Ladakh were a dream come true. Our guide knew exactly where to take us for the best shots at the perfect time of day. The team was flexible with our schedule and accommodated all our requests.',
      status: 'published',
      date: '2025-04-15',
    },
  ],

  faqs: [
    {
      question: 'What is the best time to visit Kashmir?',
      answer: 'The best time to visit Kashmir is from April to October. Spring (April to June) offers blooming gardens, summer (July to August) has pleasant weather, and autumn (September to October) showcases golden landscapes.',
      category: 'General',
      published: true,
    },
    {
      question: 'Do I need special permits for Ladakh?',
      answer: 'Yes, certain areas in Ladakh require Inner Line Permits (ILP). Our tour packages include obtaining these permits for you, so you don\'t need to worry about the process.',
      category: 'Travel Requirements',
      published: true,
    },
    {
      question: 'What type of accommodation is provided?',
      answer: 'We offer a range of accommodations based on the package you choose, from luxury houseboats in Kashmir to comfortable hotels and camps in Ladakh. All accommodations are carefully selected for comfort, cleanliness, and authentic experience.',
      category: 'Accommodations',
      published: true,
    },
    {
      question: 'Is Gurez Valley safe to visit?',
      answer: 'Yes, Gurez Valley is safe for tourists. However, as it\'s a border area, there are certain regulations to follow. Our guides are well-versed with these regulations and will ensure a smooth experience.',
      category: 'Safety',
      published: true,
    },
    {
      question: 'How do I book a tour package?',
      answer: 'You can book a tour package by filling out the booking form on the package detail page or by contacting us directly via phone or email. We require a 20% advance payment to confirm the booking.',
      category: 'Booking',
      published: true,
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Our cancellation policy allows for a full refund if canceled 30 days before the trip, 50% refund if canceled 15-30 days before, and no refund for cancellations less than 15 days before the trip.',
      category: 'Policies',
      published: true,
    },
  ],
};

// Helper functions
async function clearTable(tableName) {
  try {
    const { error } = await supabase.from(tableName).delete().neq('id', -1);
    if (error) throw error;
    console.log(chalk.green(`✓ Cleared ${tableName}`));
  } catch (error) {
    console.error(chalk.red(`✗ Error clearing ${tableName}:`), error.message);
  }
}

async function seedDestinations() {
  console.log(chalk.blue('\n📍 Seeding Destinations...'));
  try {
    const { data, error } = await supabase.from('destinations').insert(seedData.destinations).select();
    if (error) throw error;
    console.log(chalk.green(`✓ Seeded ${data.length} destinations`));
    return data;
  } catch (error) {
    console.error(chalk.red('✗ Error seeding destinations:'), error.message);
    return [];
  }
}

async function seedPackages() {
  console.log(chalk.blue('\n🎫 Seeding Packages...'));
  try {
    const { data, error } = await supabase.from('packages').insert(seedData.packages).select();
    if (error) throw error;
    console.log(chalk.green(`✓ Seeded ${data.length} packages`));
    return data;
  } catch (error) {
    console.error(chalk.red('✗ Error seeding packages:'), error.message);
    return [];
  }
}

async function seedTestimonials() {
  console.log(chalk.blue('\n⭐ Seeding Testimonials...'));
  try {
    const { data, error } = await supabase.from('testimonials').insert(seedData.testimonials).select();
    if (error) throw error;
    console.log(chalk.green(`✓ Seeded ${data.length} testimonials`));
  } catch (error) {
    console.error(chalk.red('✗ Error seeding testimonials:'), error.message);
  }
}

async function seedFAQs() {
  console.log(chalk.blue('\n❓ Seeding FAQs...'));
  try {
    const { data, error } = await supabase.from('faqs').insert(seedData.faqs).select();
    if (error) throw error;
    console.log(chalk.green(`✓ Seeded ${data.length} FAQs`));
  } catch (error) {
    console.error(chalk.red('✗ Error seeding FAQs:'), error.message);
  }
}

async function seedAdminUsers() {
  console.log(chalk.blue('\n👤 Seeding Admin Users...'));
  try {
    const adminUsers = [
      {
        name: 'Admin User',
        email: 'admin@jklgtravel.com',
        phone: '+91 98765 43210',
        role: 'Admin',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32',
        status: 'Active',
      },
      {
        name: 'Priya Kaul',
        email: 'priya@jklgtravel.com',
        phone: '+91 98765 43211',
        role: 'Manager',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=32',
        status: 'Active',
      },
      {
        name: 'Raj Gupta',
        email: 'raj@jklgtravel.com',
        phone: '+91 98765 43212',
        role: 'Guide',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32',
        status: 'Active',
      },
      {
        name: 'Zara Khan',
        email: 'zara@jklgtravel.com',
        phone: '+91 98765 43213',
        role: 'Support',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32',
        status: 'Active',
      },
    ];

    const { data, error } = await supabase.from('admin_users').insert(adminUsers).select();
    if (error) throw error;
    console.log(chalk.green(`✓ Seeded ${data.length} admin users`));
  } catch (error) {
    console.error(chalk.red('✗ Error seeding admin users:'), error.message);
  }
}

async function seedBookings() {
  console.log(chalk.blue('\n📅 Seeding Bookings...'));
  try {
    const bookings = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43214',
        package: 'Kashmir Bliss: 6 Days Tour',
        travel_date: '2025-07-15',
        booking_date: '2025-06-01',
        amount: 24999,
        status: 'Confirmed',
        message: 'Looking forward to the trip!',
        payment_status: 'Paid',
        source: 'Website',
      },
      {
        name: 'Priya Singh',
        email: 'priya.singh@example.com',
        phone: '+91 98765 43215',
        package: 'Ladakh Adventure: 8 Days Tour',
        travel_date: '2025-07-20',
        booking_date: '2025-06-02',
        amount: 34999,
        status: 'Confirmed',
        message: 'Please arrange for vegetarian meals.',
        payment_status: 'Paid',
        source: 'Website',
      },
      {
        name: 'Ajay Patel',
        email: 'ajay.patel@example.com',
        phone: '+91 98765 43216',
        package: 'Gurez Valley Explorer: 5 Days Tour',
        travel_date: '2025-07-18',
        booking_date: '2025-06-01',
        amount: 22999,
        status: 'Pending',
        message: 'Would like to know more about the local attractions.',
        payment_status: 'Pending',
        source: 'Phone',
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        phone: '+44 7911 123456',
        package: 'Jammu Heritage Tour: 4 Days',
        travel_date: '2025-08-05',
        booking_date: '2025-06-03',
        amount: 18999,
        status: 'Confirmed',
        message: 'First time visiting India, very excited!',
        payment_status: 'Paid',
        source: 'Website',
      },
      {
        name: 'David Lee',
        email: 'david.lee@example.com',
        phone: '+65 9123 4567',
        package: 'Ladakh Adventure: 8 Days Tour',
        travel_date: '2025-08-10',
        booking_date: '2025-06-04',
        amount: 34999,
        status: 'Pending',
        message: 'I have altitude sickness concerns, can we discuss?',
        payment_status: 'Pending',
        source: 'Email',
      },
    ];

    const { data, error } = await supabase.from('bookings').insert(bookings).select();
    if (error) throw error;
    console.log(chalk.green(`✓ Seeded ${data.length} bookings`));
  } catch (error) {
    console.error(chalk.red('✗ Error seeding bookings:'), error.message);
  }
}

async function seedGallery() {
  console.log(chalk.blue('\n🖼️ Seeding Gallery...'));
  try {
    const gallery = [
      { title: 'Dal Lake Sunset', location: 'Srinagar, Kashmir', image: 'https://images.pexels.com/photos/7680353/pexels-photo-7680353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Gulmarg Snowscape', location: 'Gulmarg, Kashmir', image: 'https://images.pexels.com/photos/4254554/pexels-photo-4254554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Pangong Lake Reflections', location: 'Ladakh', image: 'https://images.pexels.com/photos/15769401/pexels-photo-15769401/free-photo-of-landscape-with-mountains-lake-and-snow.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Nubra Valley Serenity', location: 'Nubra Valley, Ladakh', image: 'https://images.pexels.com/photos/9726393/pexels-photo-9726393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Gurez Valley Panorama', location: 'Gurez Valley', image: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Vaishno Devi Temple', location: 'Jammu', image: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Tulip Gardens', location: 'Srinagar, Kashmir', image: 'https://images.pexels.com/photos/4094269/pexels-photo-4094269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Magnetic Hill', location: 'Ladakh', image: 'https://images.pexels.com/photos/13580526/pexels-photo-13580526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Betaab Valley', location: 'Pahalgam, Kashmir', image: 'https://images.pexels.com/photos/13326901/pexels-photo-13326901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Zanskar River', location: 'Ladakh', image: 'https://images.pexels.com/photos/14194994/pexels-photo-14194994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Leh Palace', location: 'Leh, Ladakh', image: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
      { title: 'Shalimar Garden', location: 'Srinagar, Kashmir', image: 'https://images.pexels.com/photos/12918978/pexels-photo-12918978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    ];

    const { data, error } = await supabase.from('gallery').insert(gallery).select();
    if (error) throw error;
    console.log(chalk.green(`✓ Seeded ${data.length} gallery items`));
  } catch (error) {
    console.error(chalk.red('✗ Error seeding gallery:'), error.message);
  }
}

async function seedItineraries(packages) {
  console.log(chalk.blue('\n🗺️ Seeding Itineraries...'));
  try {
    const itineraries = [];

    // Kashmir Bliss Itinerary
    if (packages[0]) {
      itineraries.push(
        { package_id: packages[0].id, day: 1, title: 'Arrival in Srinagar', description: 'Arrive at Srinagar Airport and transfer to your houseboat on Dal Lake. Enjoy a relaxing shikara ride in the evening.' },
        { package_id: packages[0].id, day: 2, title: 'Srinagar City Tour', description: 'Visit Mughal Gardens, Shankaracharya Temple, and local markets. Enjoy another night on the houseboat.' },
        { package_id: packages[0].id, day: 3, title: 'Gulmarg Excursion', description: 'Full-day excursion to Gulmarg. Enjoy the Gondola ride (optional) and panoramic views of the Himalayas.' },
        { package_id: packages[0].id, day: 4, title: 'Pahalgam Visit', description: 'Drive to Pahalgam, visiting Avantipura ruins and saffron fields en route. Check-in at hotel in Pahalgam.' },
        { package_id: packages[0].id, day: 5, title: 'Pahalgam Exploration', description: 'Explore the beautiful valleys of Aru, Betaab, and Chandanwari (subject to weather conditions).' },
        { package_id: packages[0].id, day: 6, title: 'Departure', description: 'Return to Srinagar and transfer to the airport for your departure flight.' }
      );
    }

    // Ladakh Adventure Itinerary
    if (packages[1]) {
      itineraries.push(
        { package_id: packages[1].id, day: 1, title: 'Arrival in Leh', description: 'Arrive at Leh Airport and transfer to your hotel. Rest for acclimatization.' },
        { package_id: packages[1].id, day: 2, title: 'Leh Local Sightseeing', description: 'Visit Shanti Stupa, Leh Palace, and Namgyal Tsemo Monastery.' },
        { package_id: packages[1].id, day: 3, title: 'Leh to Nubra Valley', description: 'Drive to Nubra Valley via Khardung La (one of the highest motorable roads). Visit Diskit Monastery and Hunder sand dunes.' },
        { package_id: packages[1].id, day: 4, title: 'Nubra Valley to Pangong Lake', description: 'Drive to Pangong Lake via Shyok river route. Enjoy the mesmerizing views of the changing colors of the lake.' },
        { package_id: packages[1].id, day: 5, title: 'Pangong Lake to Leh', description: 'Return to Leh via Chang La pass, visiting Thiksey Monastery en route.' },
        { package_id: packages[1].id, day: 6, title: 'Excursion to Alchi and Lamayuru', description: 'Day trip to Alchi and Lamayuru monasteries, some of the oldest in Ladakh.' },
        { package_id: packages[1].id, day: 7, title: 'Leh Leisure Day', description: 'Free day for shopping and relaxation in Leh.' },
        { package_id: packages[1].id, day: 8, title: 'Departure', description: 'Transfer to Leh Airport for your departure flight.' }
      );
    }

    // Gurez Valley Itinerary
    if (packages[2]) {
      itineraries.push(
        { package_id: packages[2].id, day: 1, title: 'Arrival in Srinagar', description: 'Arrive at Srinagar Airport and transfer to your hotel. Evening at leisure.' },
        { package_id: packages[2].id, day: 2, title: 'Srinagar to Gurez Valley', description: 'Drive to Gurez Valley via Razdan Pass. Check-in at guesthouse in Dawar.' },
        { package_id: packages[2].id, day: 3, title: 'Exploring Gurez Valley', description: 'Visit Habba Khatoon Peak, Tulail Valley, and traditional Dard-Shin villages.' },
        { package_id: packages[2].id, day: 4, title: 'Gurez to Srinagar', description: 'Return to Srinagar. Evening at leisure for shopping.' },
        { package_id: packages[2].id, day: 5, title: 'Departure', description: 'Transfer to Srinagar Airport for your departure flight.' }
      );
    }

    // Jammu Heritage Itinerary
    if (packages[3]) {
      itineraries.push(
        { package_id: packages[3].id, day: 1, title: 'Arrival in Jammu', description: 'Arrive at Jammu Airport and transfer to your hotel. Visit Raghunath Temple and Bahu Fort.' },
        { package_id: packages[3].id, day: 2, title: 'Jammu to Katra', description: 'Drive to Katra, the base for Vaishno Devi pilgrimage. Check-in at hotel and prepare for the trek.' },
        { package_id: packages[3].id, day: 3, title: 'Vaishno Devi Darshan', description: 'Early morning trek to Vaishno Devi Temple (optional helicopter service available). Return to Katra in evening.' },
        { package_id: packages[3].id, day: 4, title: 'Departure', description: 'Return to Jammu and transfer to the airport for your departure flight.' }
      );
    }

    if (itineraries.length > 0) {
      const { data, error } = await supabase.from('itineraries').insert(itineraries).select();
      if (error) throw error;
      console.log(chalk.green(`✓ Seeded ${data.length} itineraries`));
    }
  } catch (error) {
    console.error(chalk.red('✗ Error seeding itineraries:'), error.message);
  }
}

async function seedSupportTickets() {
  console.log(chalk.blue('\n🎫 Seeding Support Tickets...'));
  try {
    const tickets = [
      {
        subject: 'Question about Kashmir Bliss Tour',
        customer: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        status: 'Open',
        priority: 'Medium',
        category: 'Information',
        last_update: new Date().toISOString(),
      },
      {
        subject: 'Need to change travel date',
        customer: 'Priya Singh',
        email: 'priya.singh@example.com',
        status: 'In Progress',
        priority: 'High',
        category: 'Booking',
        assigned_to: 'Zara Khan',
        last_update: new Date().toISOString(),
      },
      {
        subject: 'Requesting vegetarian meal option',
        customer: 'Ajay Patel',
        email: 'ajay.patel@example.com',
        status: 'Open',
        priority: 'Low',
        category: 'Customization',
        last_update: new Date().toISOString(),
      },
      {
        subject: 'Issue with payment',
        customer: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        status: 'Closed',
        priority: 'High',
        category: 'Payment',
        assigned_to: 'Priya Kaul',
        last_update: new Date().toISOString(),
      },
    ];

    const { data, error } = await supabase.from('support_tickets').insert(tickets).select();
    if (error) throw error;
    console.log(chalk.green(`✓ Seeded ${data.length} support tickets`));
  } catch (error) {
    console.error(chalk.red('✗ Error seeding support tickets:'), error.message);
  }
}

// Main seed function
async function main() {
  const args = process.argv.slice(2);
  const shouldReset = args.includes('--reset') || args.includes('--fresh');

  console.log(chalk.bold.cyan('\n🌍 JKLG Travel Agency - Database Seeding Script\n'));

  // Validation
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error(chalk.red('❌ Missing Supabase credentials in .env file'));
    process.exit(1);
  }

  console.log(chalk.yellow(`📦 Database: ${SUPABASE_URL}`));

  try {
    if (shouldReset) {
      console.log(chalk.yellow('\n🔄 Clearing existing data...\n'));
      await clearTable('itineraries');
      await clearTable('packages');
      await clearTable('destinations');
      await clearTable('testimonials');
      await clearTable('faqs');
      await clearTable('admin_users');
      await clearTable('bookings');
      await clearTable('gallery');
      await clearTable('support_tickets');
    }

    // Seed in order of dependencies
    await seedDestinations();
    const packages = await seedPackages();
    await seedTestimonials();
    await seedFAQs();
    await seedAdminUsers();
    await seedBookings();
    await seedGallery();
    await seedItineraries(packages);
    await seedSupportTickets();

    console.log(chalk.bold.green('\n✅ Database seeding completed successfully!\n'));
    console.log(chalk.cyan('Test credentials:'));
    console.log(chalk.white('  Email: admin@jklgtravel.com'));
    console.log(chalk.white('  Password: admin123\n'));
  } catch (error) {
    console.error(chalk.red('\n❌ Seeding failed:'), error.message);
    process.exit(1);
  }
}

main().catch(console.error);
