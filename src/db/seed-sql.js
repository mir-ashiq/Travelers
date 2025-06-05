import initSqlJs from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

// Global database instance
let db = null;
let SQL = null;

// Initialize SQL.js and create an in-memory database
async function initDatabase() {
  if (!db) {
    try {
      // Initialize SQL.js
      SQL = await initSqlJs({
        // Use the imported WebAssembly URL
        locateFile: file => sqlWasmUrl
      });
      
      // Create a new in-memory database
      db = new SQL.Database();
      
      console.log('SQLite database initialized');
      
      // Create schema if it doesn't exist
      createSchema();
      return true;
    } catch (error) {
      console.error('Failed to initialize SQLite database:', error);
      return false;
    }
  }
  
  return true;
}

// Helper function to execute a query
function executeQuery(query, params = []) {
  try {
    const stmt = db.prepare(query);
    stmt.bind(params);
    stmt.step();
    stmt.free();
    
    return true;
  } catch (error) {
    console.error(`Error executing query: ${query}`, error);
    return false;
  }
}

// Create database schema
function createSchema() {
  // FAQs table
  db.run(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT NOT NULL,
      published BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Support tickets table
  db.run(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      customer TEXT NOT NULL,
      email TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('Open', 'In Progress', 'Closed')),
      priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
      category TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      assigned_to TEXT,
      last_update TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ticket messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS ticket_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      from_type TEXT NOT NULL CHECK (from_type IN ('customer', 'agent')),
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    );
  `);

  // Destinations table
  db.run(`
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      region TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      featured BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Packages table
  db.run(`
    CREATE TABLE IF NOT EXISTS packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      image TEXT NOT NULL,
      destinations TEXT NOT NULL, -- Stored as JSON string
      featured BOOLEAN DEFAULT 0,
      rating REAL DEFAULT 0.0,
      accommodations TEXT NOT NULL,
      included TEXT NOT NULL, -- Stored as JSON string
      excluded TEXT NOT NULL, -- Stored as JSON string
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Itineraries table
  db.run(`
    CREATE TABLE IF NOT EXISTS itineraries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      package_id INTEGER NOT NULL,
      day INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
    );
  `);

  // Gallery table
  db.run(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      image TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('Admin', 'Manager', 'Guide', 'Support')),
      avatar TEXT,
      status TEXT NOT NULL CHECK (status IN ('Active', 'Inactive')),
      password TEXT NOT NULL DEFAULT 'admin123',
      last_login TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Bookings table
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      package TEXT NOT NULL,
      travel_date TEXT NOT NULL,
      booking_date TEXT NOT NULL,
      amount INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
      message TEXT,
      payment_status TEXT NOT NULL CHECK (payment_status IN ('Paid', 'Pending', 'Refunded')),
      source TEXT NOT NULL,
      assigned_to TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Blog posts table
  db.run(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      featured_image TEXT NOT NULL,
      author TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL, -- Stored as JSON string
      status TEXT NOT NULL CHECK (status IN ('Published', 'Draft')),
      views INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Testimonials table
  db.run(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      location TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      message TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('published', 'pending', 'rejected')),
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  console.log('Database schema created successfully');
}

// Clear existing data before seeding
function clearDatabase() {
  console.log('Clearing existing data...');
  
  const tables = [
    'faqs',
    'ticket_messages',
    'support_tickets',
    'itineraries',
    'packages',
    'destinations',
    'gallery',
    'bookings',
    'testimonials',
    'blog_posts',
    'admin_users'
  ];
  
  for (const table of tables) {
    executeQuery(`DELETE FROM ${table}`);
  }
  
  console.log('All tables cleared successfully.');
}

// Seed FAQs
function seedFAQs() {
  console.log('Seeding FAQs...');
  const faqs = [
    {
      question: 'What is the best time to visit Kashmir?',
      answer: 'The best time to visit Kashmir is from April to October. Spring (April to June) offers blooming gardens, summer (July to August) has pleasant weather, and autumn (September to October) showcases golden landscapes.',
      category: 'General',
      published: 1
    },
    {
      question: 'Do I need special permits for Ladakh?',
      answer: 'Yes, certain areas in Ladakh require Inner Line Permits (ILP). Our tour packages include obtaining these permits for you, so you don\'t need to worry about the process.',
      category: 'Permits & Documentation',
      published: 1
    },
    {
      question: 'How do I book a tour package?',
      answer: 'You can book a tour package by filling out the booking form on the package detail page or by contacting us directly via phone or email. No advance payment is required for booking.',
      category: 'Booking',
      published: 1
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Our cancellation policy depends on how far in advance you cancel. Cancellations made 30+ days before the trip receive a full refund minus processing fees. Cancellations 15-29 days prior receive a 75% refund, 7-14 days prior receive a 50% refund, and less than 7 days receive no refund.',
      category: 'Booking',
      published: 1
    },
    {
      question: 'Do you offer customized tour packages?',
      answer: 'Yes, we offer customized tour packages tailored to your preferences, budget, and time constraints. Contact us with your requirements, and we\'ll create a personalized itinerary for you.',
      category: 'Packages',
      published: 1
    },
    {
      question: 'What type of accommodations do you provide?',
      answer: 'We offer a range of accommodations based on the package you choose, from luxury houseboats and 5-star hotels to mid-range hotels and budget-friendly guesthouses. All accommodations are carefully selected to ensure comfort and quality.',
      category: 'Accommodations',
      published: 1
    },
    {
      question: 'Is it safe to travel to Kashmir and Ladakh?',
      answer: 'Yes, the tourist areas of Kashmir and Ladakh are safe for travelers. We prioritize the safety of our guests and continuously monitor local conditions. Our guides are well-informed about the regions and safety protocols.',
      category: 'Safety',
      published: 0
    }
  ];

  let count = 0;
  for (const faq of faqs) {
    const query = `INSERT INTO faqs (question, answer, category, published) VALUES (?, ?, ?, ?)`;
    if (executeQuery(query, [faq.question, faq.answer, faq.category, faq.published])) {
      count++;
    }
  }
  
  console.log(`Added ${count} FAQs`);
}

// Seed Destinations
function seedDestinations() {
  console.log('Seeding Destinations...');
  const destinations = [
    {
      name: 'Dal Lake',
      region: 'Kashmir',
      description: 'Known as the "Jewel in the crown of Kashmir", Dal Lake is famous for its houseboats and floating gardens.',
      image: 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: 1
    },
    {
      name: 'Gulmarg',
      region: 'Kashmir',
      description: 'A premier ski destination with breathtaking meadows, Gulmarg offers stunning views of snow-capped mountains.',
      image: 'https://images.pexels.com/photos/4254554/pexels-photo-4254554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: 1
    },
    {
      name: 'Pangong Lake',
      region: 'Ladakh',
      description: 'This stunning high-altitude lake changes colors throughout the day and is surrounded by barren mountains.',
      image: 'https://images.pexels.com/photos/37057/scooter-india-nomad-landscape.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: 1
    },
    {
      name: 'Nubra Valley',
      region: 'Ladakh',
      description: 'Known for its orchards, rare double-humped camels and dramatic landscapes.',
      image: 'https://images.pexels.com/photos/9726393/pexels-photo-9726393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: 1
    },
    {
      name: 'Gurez Valley',
      region: 'Gurez',
      description: 'A remote and untouched valley with pristine beauty, traditional villages, and stunning mountain views.',
      image: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: 1
    },
    {
      name: 'Vaishno Devi',
      region: 'Jammu',
      description: 'One of the most revered Hindu pilgrimage sites, nestled in the Trikuta Mountains.',
      image: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: 1
    },
    {
      name: 'Sonamarg',
      region: 'Kashmir',
      description: 'Meaning "Meadow of Gold", Sonamarg offers breathtaking vistas of snow-clad mountains and glaciers.',
      image: 'https://images.pexels.com/photos/12918978/pexels-photo-12918978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: 0
    },
    {
      name: 'Leh Palace',
      region: 'Ladakh',
      description: 'A former royal palace with a striking resemblance to the Potala Palace in Tibet.',
      image: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      featured: 0
    }
  ];

  let count = 0;
  for (const destination of destinations) {
    const query = `INSERT INTO destinations (name, region, description, image, featured) 
                  VALUES (?, ?, ?, ?, ?)`;
    if (executeQuery(query, [
      destination.name,
      destination.region,
      destination.description,
      destination.image,
      destination.featured
    ])) {
      count++;
    }
  }
  
  console.log(`Added ${count} destinations`);
}

// Seed Packages and Itineraries
function seedPackagesAndItineraries() {
  console.log('Seeding Packages and Itineraries...');
  
  // Define packages
  const packages = [
    {
      id: 1,
      title: 'Kashmir Bliss: 6 Days Tour',
      description: 'Experience the pristine beauty of Kashmir with visits to Srinagar, Gulmarg, and Pahalgam. Enjoy shikara rides, stunning gardens, and snow-capped mountains.',
      price: 24999,
      duration: 6,
      image: 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      destinations: JSON.stringify(['Srinagar', 'Gulmarg', 'Pahalgam']),
      featured: 1,
      rating: 4.8,
      accommodations: 'Luxury houseboats and 4-star hotels',
      included: JSON.stringify([
        'Airport transfers',
        'Accommodation',
        'Daily breakfast and dinner',
        'Sightseeing as per itinerary',
        'English-speaking guide',
        'All applicable taxes'
      ]),
      excluded: JSON.stringify([
        'Airfare',
        'Lunch',
        'Personal expenses',
        'Travel insurance',
        'Optional activities'
      ])
    },
    {
      id: 2,
      title: 'Ladakh Adventure: 8 Days Tour',
      description: 'Embark on an adventure through the stunning landscapes of Ladakh. Visit Leh, Nubra Valley, Pangong Lake, and more.',
      price: 34999,
      duration: 8,
      image: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      destinations: JSON.stringify(['Leh', 'Nubra Valley', 'Pangong Lake', 'Khardung La']),
      featured: 1,
      rating: 4.9,
      accommodations: '3-star hotels and luxury camps',
      included: JSON.stringify([
        'Airport transfers',
        'Accommodation',
        'All meals',
        'Sightseeing as per itinerary',
        'Inner Line Permits',
        'English-speaking guide',
        'All applicable taxes'
      ]),
      excluded: JSON.stringify([
        'Airfare',
        'Personal expenses',
        'Travel insurance',
        'Optional activities'
      ])
    },
    {
      id: 3,
      title: 'Gurez Valley Explorer: 5 Days Tour',
      description: 'Discover the untouched beauty of Gurez Valley, one of Kashmir\'s hidden gems with pristine landscapes and rich culture.',
      price: 22999,
      duration: 5,
      image: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      destinations: JSON.stringify(['Srinagar', 'Gurez Valley', 'Dawar']),
      featured: 1,
      rating: 4.7,
      accommodations: '3-star hotels and guesthouses',
      included: JSON.stringify([
        'Airport transfers',
        'Accommodation',
        'All meals',
        'Sightseeing as per itinerary',
        'Permits',
        'English-speaking guide',
        'All applicable taxes'
      ]),
      excluded: JSON.stringify([
        'Airfare',
        'Personal expenses',
        'Travel insurance',
        'Optional activities'
      ])
    },
    {
      id: 4,
      title: 'Jammu Heritage Tour: 4 Days',
      description: 'Explore the rich cultural heritage of Jammu with visits to temples, palaces, and natural wonders.',
      price: 18999,
      duration: 4,
      image: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      destinations: JSON.stringify(['Jammu', 'Vaishno Devi', 'Patnitop']),
      featured: 1,
      rating: 4.6,
      accommodations: '3-star and 4-star hotels',
      included: JSON.stringify([
        'Airport transfers',
        'Accommodation',
        'Daily breakfast',
        'Sightseeing as per itinerary',
        'English-speaking guide',
        'All applicable taxes'
      ]),
      excluded: JSON.stringify([
        'Airfare',
        'Lunch and dinner',
        'Personal expenses',
        'Travel insurance',
        'Optional activities',
        'Helicopter tickets for Vaishno Devi'
      ])
    }
  ];

  // Add packages
  let packageCount = 0;
  for (const pkg of packages) {
    const query = `INSERT INTO packages (
      id, title, description, price, duration, image, destinations,
      featured, rating, accommodations, included, excluded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    if (executeQuery(query, [
      pkg.id,
      pkg.title,
      pkg.description,
      pkg.price,
      pkg.duration,
      pkg.image,
      pkg.destinations,
      pkg.featured,
      pkg.rating,
      pkg.accommodations,
      pkg.included,
      pkg.excluded
    ])) {
      packageCount++;
    }
  }
  
  console.log(`Added ${packageCount} packages`);

  // Define itineraries
  const itineraries = [
    // Kashmir Bliss Tour
    { package_id: 1, day: 1, title: 'Arrival in Srinagar', description: 'Arrive at Srinagar Airport and transfer to your houseboat on Dal Lake. Enjoy a relaxing shikara ride in the evening.' },
    { package_id: 1, day: 2, title: 'Srinagar City Tour', description: 'Visit Mughal Gardens, Shankaracharya Temple, and local markets. Enjoy another night on the houseboat.' },
    { package_id: 1, day: 3, title: 'Gulmarg Excursion', description: 'Full-day excursion to Gulmarg. Enjoy the Gondola ride (optional) and panoramic views of the Himalayas.' },
    { package_id: 1, day: 4, title: 'Pahalgam Visit', description: 'Drive to Pahalgam, visiting Avantipura ruins and saffron fields en route. Check-in at hotel in Pahalgam.' },
    { package_id: 1, day: 5, title: 'Pahalgam Exploration', description: 'Explore the beautiful valleys of Aru, Betaab, and Chandanwari (subject to weather conditions).' },
    { package_id: 1, day: 6, title: 'Departure', description: 'Return to Srinagar and transfer to the airport for your departure flight.' },
    
    // Ladakh Adventure Tour
    { package_id: 2, day: 1, title: 'Arrival in Leh', description: 'Arrive at Leh Airport and transfer to your hotel. Rest for acclimatization.' },
    { package_id: 2, day: 2, title: 'Leh Local Sightseeing', description: 'Visit Shanti Stupa, Leh Palace, and Namgyal Tsemo Monastery.' },
    { package_id: 2, day: 3, title: 'Leh to Nubra Valley', description: 'Drive to Nubra Valley via Khardung La (one of the highest motorable roads). Visit Diskit Monastery and Hunder sand dunes.' },
    { package_id: 2, day: 4, title: 'Nubra Valley to Pangong Lake', description: 'Drive to Pangong Lake via Shyok river route. Enjoy the mesmerizing views of the changing colors of the lake.' },
    { package_id: 2, day: 5, title: 'Pangong Lake to Leh', description: 'Return to Leh via Chang La pass, visiting Thiksey Monastery en route.' },
    { package_id: 2, day: 6, title: 'Excursion to Alchi and Lamayuru', description: 'Day trip to Alchi and Lamayuru monasteries, some of the oldest in Ladakh.' },
    { package_id: 2, day: 7, title: 'Leh Leisure Day', description: 'Free day for shopping and relaxation in Leh.' },
    { package_id: 2, day: 8, title: 'Departure', description: 'Transfer to Leh Airport for your departure flight.' },
    
    // Gurez Valley Tour
    { package_id: 3, day: 1, title: 'Arrival in Srinagar', description: 'Arrive at Srinagar Airport and transfer to your hotel. Evening at leisure.' },
    { package_id: 3, day: 2, title: 'Srinagar to Gurez Valley', description: 'Drive to Gurez Valley via Razdan Pass. Check-in at guesthouse in Dawar.' },
    { package_id: 3, day: 3, title: 'Exploring Gurez Valley', description: 'Visit Habba Khatoon Peak, Tulail Valley, and traditional Dard-Shin villages.' },
    { package_id: 3, day: 4, title: 'Gurez to Srinagar', description: 'Return to Srinagar. Evening at leisure for shopping.' },
    { package_id: 3, day: 5, title: 'Departure', description: 'Transfer to Srinagar Airport for your departure flight.' },
    
    // Jammu Heritage Tour
    { package_id: 4, day: 1, title: 'Arrival in Jammu', description: 'Arrive at Jammu Airport and transfer to your hotel. Visit Raghunath Temple and Bahu Fort.' },
    { package_id: 4, day: 2, title: 'Jammu to Katra', description: 'Drive to Katra, the base for Vaishno Devi pilgrimage. Check-in at hotel and prepare for the trek.' },
    { package_id: 4, day: 3, title: 'Vaishno Devi Darshan', description: 'Early morning trek to Vaishno Devi Temple (optional helicopter service available). Return to Katra in evening.' },
    { package_id: 4, day: 4, title: 'Departure', description: 'Return to Jammu and transfer to the airport for your departure flight.' }
  ];

  // Add itineraries
  let itineraryCount = 0;
  for (const itinerary of itineraries) {
    const query = `INSERT INTO itineraries (package_id, day, title, description) VALUES (?, ?, ?, ?)`;
    if (executeQuery(query, [
      itinerary.package_id,
      itinerary.day,
      itinerary.title,
      itinerary.description
    ])) {
      itineraryCount++;
    }
  }
  
  console.log(`Added ${itineraryCount} itinerary items`);
}

// Seed Gallery
function seedGallery() {
  console.log('Seeding Gallery...');
  const galleryItems = [
    {
      title: 'Dal Lake Sunset',
      location: 'Srinagar, Kashmir',
      image: 'https://images.pexels.com/photos/7680353/pexels-photo-7680353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Gulmarg Snowscape',
      location: 'Gulmarg, Kashmir',
      image: 'https://images.pexels.com/photos/4254554/pexels-photo-4254554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Pangong Lake Reflections',
      location: 'Ladakh',
      image: 'https://images.pexels.com/photos/15769401/pexels-photo-15769401/free-photo-of-landscape-with-mountains-lake-and-snow.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Nubra Valley Serenity',
      location: 'Nubra Valley, Ladakh',
      image: 'https://images.pexels.com/photos/9726393/pexels-photo-9726393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Gurez Valley Panorama',
      location: 'Gurez Valley',
      image: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Vaishno Devi Temple',
      location: 'Jammu',
      image: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Tulip Gardens',
      location: 'Srinagar, Kashmir',
      image: 'https://images.pexels.com/photos/4094269/pexels-photo-4094269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Magnetic Hill',
      location: 'Ladakh',
      image: 'https://images.pexels.com/photos/13580526/pexels-photo-13580526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Betaab Valley',
      location: 'Pahalgam, Kashmir',
      image: 'https://images.pexels.com/photos/13326901/pexels-photo-13326901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Zanskar River',
      location: 'Ladakh',
      image: 'https://images.pexels.com/photos/14194994/pexels-photo-14194994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Leh Palace',
      location: 'Leh, Ladakh',
      image: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      title: 'Shalimar Garden',
      location: 'Srinagar, Kashmir',
      image: 'https://images.pexels.com/photos/12918978/pexels-photo-12918978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  let count = 0;
  for (const item of galleryItems) {
    const query = `INSERT INTO gallery (title, location, image) VALUES (?, ?, ?)`;
    if (executeQuery(query, [item.title, item.location, item.image])) {
      count++;
    }
  }
  
  console.log(`Added ${count} gallery items`);
}

// Seed Admin Users
function seedAdminUsers() {
  console.log('Seeding Admin Users...');
  const adminUsers = [
    {
      name: 'Admin User',
      email: 'admin@jklgtravel.com',
      phone: '+91 98765 43210',
      role: 'Admin',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32',
      status: 'Active',
      password: 'admin123'
    },
    {
      name: 'Priya Kaul',
      email: 'priya@jklgtravel.com',
      phone: '+91 98765 43211',
      role: 'Manager',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=32',
      status: 'Active',
      password: 'manager123'
    },
    {
      name: 'Raj Gupta',
      email: 'raj@jklgtravel.com',
      phone: '+91 98765 43212',
      role: 'Guide',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32',
      status: 'Active',
      password: 'guide123'
    },
    {
      name: 'Zara Khan',
      email: 'zara@jklgtravel.com',
      phone: '+91 98765 43213',
      role: 'Support',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32',
      status: 'Active',
      password: 'support123'
    }
  ];

  let count = 0;
  for (const user of adminUsers) {
    const query = `INSERT INTO admin_users (name, email, phone, role, avatar, status, password) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`;
    if (executeQuery(query, [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.avatar,
      user.status,
      user.password
    ])) {
      count++;
    }
  }
  
  console.log(`Added ${count} admin users`);
}

// Seed Bookings
function seedBookings() {
  console.log('Seeding Bookings...');
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
      assigned_to: 'Priya Kaul'
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
      assigned_to: 'Raj Gupta'
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
      assigned_to: null
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
      assigned_to: 'Aarav Sharma'
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
      assigned_to: null
    }
  ];

  let count = 0;
  for (const booking of bookings) {
    const query = `INSERT INTO bookings (
      name, email, phone, package, travel_date, booking_date,
      amount, status, message, payment_status, source, assigned_to
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    if (executeQuery(query, [
      booking.name,
      booking.email,
      booking.phone,
      booking.package,
      booking.travel_date,
      booking.booking_date,
      booking.amount,
      booking.status,
      booking.message,
      booking.payment_status,
      booking.source,
      booking.assigned_to
    ])) {
      count++;
    }
  }
  
  console.log(`Added ${count} bookings`);
}

// Seed Support Tickets and Messages
function seedSupportTickets() {
  console.log('Seeding Support Tickets and Messages...');
  
  // Define support tickets
  const tickets = [
    {
      id: 1001,
      subject: 'Cancellation request for Kashmir Bliss Package',
      customer: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      status: 'Open',
      priority: 'High',
      category: 'Booking',
      assigned_to: 'Zara Khan',
      last_update: '2025-06-01 14:30:00'
    },
    {
      id: 1002,
      subject: 'Request for customization of Ladakh itinerary',
      customer: 'Priya Singh',
      email: 'priya.s@example.com',
      status: 'In Progress',
      priority: 'Medium',
      category: 'Customization',
      assigned_to: 'Priya Kaul',
      last_update: '2025-05-31 09:45:00'
    },
    {
      id: 1003,
      subject: 'Query regarding Gurez Valley tour prerequisites',
      customer: 'Ajay Patel',
      email: 'ajay.p@example.com',
      status: 'Closed',
      priority: 'Low',
      category: 'Information',
      assigned_to: 'Raj Gupta',
      last_update: '2025-05-27 10:10:00'
    },
    {
      id: 1004,
      subject: 'Issue with payment for booking #3042',
      customer: 'Sarah Wilson',
      email: 'sarah.w@example.com',
      status: 'Open',
      priority: 'High',
      category: 'Payment',
      assigned_to: null,
      last_update: '2025-06-02 08:15:00'
    }
  ];

  let ticketCount = 0;
  for (const ticket of tickets) {
    const query = `INSERT INTO support_tickets (
      id, subject, customer, email, status, priority, category, assigned_to, last_update
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    if (executeQuery(query, [
      ticket.id,
      ticket.subject,
      ticket.customer,
      ticket.email,
      ticket.status,
      ticket.priority,
      ticket.category,
      ticket.assigned_to,
      ticket.last_update
    ])) {
      ticketCount++;
    }
  }
  
  console.log(`Added ${ticketCount} support tickets`);

  // Define ticket messages
  const messages = [
    {
      ticket_id: 1001,
      from_type: 'customer',
      name: 'Rahul Sharma',
      message: 'I need to cancel my Kashmir Bliss tour package booking due to a family emergency. The booking was made last week for travel dates June 15-20, 2025. Please confirm the cancellation policy and the amount that will be refunded.',
      created_at: '2025-06-01 14:30:00'
    },
    {
      ticket_id: 1002,
      from_type: 'customer',
      name: 'Priya Singh',
      message: 'I am interested in the Ladakh Adventure package but would like to add an extra day for acclimatization and also include a visit to Tso Moriri lake. Is this possible and what would be the additional cost?',
      created_at: '2025-05-30 11:15:00'
    },
    {
      ticket_id: 1002,
      from_type: 'agent',
      name: 'Priya Kaul',
      message: 'Hello Priya, thank you for your interest in our Ladakh Adventure package. Yes, we can definitely customize the itinerary to include an extra day for acclimatization and a visit to Tso Moriri lake. The additional cost would be approximately ₹8,000 per person. Would you like me to prepare a detailed customized itinerary for you?',
      created_at: '2025-05-30 14:30:00'
    },
    {
      ticket_id: 1002,
      from_type: 'customer',
      name: 'Priya Singh',
      message: 'That sounds good. Yes, please prepare a detailed itinerary with the changes. Also, would we need any additional permits for Tso Moriri?',
      created_at: '2025-05-31 09:45:00'
    },
    {
      ticket_id: 1003,
      from_type: 'customer',
      name: 'Ajay Patel',
      message: 'I am planning to book the Gurez Valley Explorer tour. Are there any specific permits required for Indian citizens? Also, what is the mobile network availability in the region?',
      created_at: '2025-05-25 16:20:00'
    },
    {
      ticket_id: 1003,
      from_type: 'agent',
      name: 'Raj Gupta',
      message: 'Hello Ajay, thank you for your interest in our Gurez Valley Explorer tour. For Indian citizens, a valid government ID proof is sufficient. However, foreign nationals require an Inner Line Permit. Regarding mobile connectivity, only BSNL network works in some parts of Gurez Valley. We recommend informing your family about limited connectivity during the tour. Let me know if you have any other questions!',
      created_at: '2025-05-26 09:30:00'
    },
    {
      ticket_id: 1003,
      from_type: 'customer',
      name: 'Ajay Patel',
      message: 'Thank you for the information. This is really helpful. I will proceed with the booking soon.',
      created_at: '2025-05-26 15:45:00'
    },
    {
      ticket_id: 1003,
      from_type: 'agent',
      name: 'Raj Gupta',
      message: 'You are welcome, Ajay! We are excited to have you experience the beautiful Gurez Valley. Feel free to reach out if you have any other questions or when you are ready to book.',
      created_at: '2025-05-27 10:10:00'
    },
    {
      ticket_id: 1004,
      from_type: 'customer',
      name: 'Sarah Wilson',
      message: 'I tried to make a payment for my booking #3042 (Jammu Heritage Tour) but the transaction failed twice. However, the amount was debited from my account both times. Please help resolve this issue as soon as possible.',
      created_at: '2025-06-02 08:15:00'
    }
  ];

  let messageCount = 0;
  for (const message of messages) {
    const query = `INSERT INTO ticket_messages (
      ticket_id, from_type, name, message, created_at
    ) VALUES (?, ?, ?, ?, ?)`;
    
    if (executeQuery(query, [
      message.ticket_id,
      message.from_type,
      message.name,
      message.message,
      message.created_at
    ])) {
      messageCount++;
    }
  }
  
  console.log(`Added ${messageCount} ticket messages`);
}

// Seed Blog Posts
function seedBlogPosts() {
  console.log('Seeding Blog Posts...');
  const posts = [
    {
      title: 'Top 10 Must-Visit Places in Kashmir Valley',
      excerpt: 'Discover the breathtaking beauty of Kashmir with our guide to the top 10 destinations that should be on every traveler\'s bucket list.',
      content: 'Full blog content here...',
      featured_image: 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=300',
      author: 'Priya Kaul',
      date: '2025-05-15',
      category: 'Destinations',
      tags: JSON.stringify(['Kashmir', 'Travel Guide', 'Sightseeing']),
      status: 'Published',
      views: 2456
    },
    {
      title: 'A Beginner\'s Guide to Trekking in Ladakh',
      excerpt: 'Planning your first trek to Ladakh? Here\'s everything you need to know about preparation, altitude sickness, best routes, and more.',
      content: 'Full blog content here...',
      featured_image: 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=300',
      author: 'Raj Gupta',
      date: '2025-05-08',
      category: 'Adventure',
      tags: JSON.stringify(['Ladakh', 'Trekking', 'Adventure Sports']),
      status: 'Published',
      views: 1832
    },
    {
      title: 'Cultural Heritage of Jammu: Beyond the Temples',
      excerpt: 'Explore the rich cultural heritage of Jammu region, from ancient forts to traditional crafts and cuisine.',
      content: 'Full blog content here...',
      featured_image: 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=300',
      author: 'Aarav Sharma',
      date: '2025-04-27',
      category: 'Culture',
      tags: JSON.stringify(['Jammu', 'Cultural Heritage', 'History']),
      status: 'Published',
      views: 1245
    },
    {
      title: 'The Hidden Gem of Kashmir: Exploring Gurez Valley',
      excerpt: 'Journey with us as we take you through the untouched beauty of Gurez Valley, one of Kashmir\'s best-kept secrets.',
      content: 'Full blog content here...',
      featured_image: 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=300',
      author: 'Zara Khan',
      date: '2025-04-20',
      category: 'Off the Beaten Path',
      tags: JSON.stringify(['Gurez', 'Hidden Gems', 'Kashmir']),
      status: 'Published',
      views: 983
    },
    {
      title: 'Sustainable Tourism in Kashmir: How to Travel Responsibly',
      excerpt: 'Learn how to minimize your environmental impact while traveling in Kashmir and contribute positively to local communities.',
      content: 'Full blog content here...',
      featured_image: 'https://images.pexels.com/photos/7680353/pexels-photo-7680353.jpeg?auto=compress&cs=tinysrgb&w=300',
      author: 'Priya Kaul',
      date: '2025-05-30',
      category: 'Sustainable Travel',
      tags: JSON.stringify(['Eco-friendly', 'Sustainable Tourism', 'Responsible Travel']),
      status: 'Draft',
      views: 0
    }
  ];

  let count = 0;
  for (const post of posts) {
    const query = `INSERT INTO blog_posts (
      title, excerpt, content, featured_image, author,
      date, category, tags, status, views
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    if (executeQuery(query, [
      post.title,
      post.excerpt,
      post.content,
      post.featured_image,
      post.author,
      post.date,
      post.category,
      post.tags,
      post.status,
      post.views
    ])) {
      count++;
    }
  }
  
  console.log(`Added ${count} blog posts`);
}

// Seed Testimonials
function seedTestimonials() {
  console.log('Seeding Testimonials...');
  const testimonials = [
    {
      name: 'Priya Sharma',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Delhi, India',
      rating: 5,
      message: 'Our trip to Kashmir was absolutely magical! The houseboat stay on Dal Lake was an unforgettable experience. The team at JKLG Travel took care of everything and made our honeymoon truly special.',
      status: 'published',
      date: '2025-05-15'
    },
    {
      name: 'James Wilson',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'London, UK',
      rating: 5,
      message: 'Ladakh was on my bucket list for years, and JKLG Travel made it happen perfectly. The itinerary was well-planned, accommodations were comfortable, and our guide was incredibly knowledgeable. Pangong Lake was even more beautiful than in pictures!',
      status: 'published',
      date: '2025-05-10'
    },
    {
      name: 'Aisha Khan',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Mumbai, India',
      rating: 4,
      message: 'We took the Gurez Valley Explorer tour and were blown away by the untouched beauty of the region. It felt like we had discovered a hidden paradise. Thank you for introducing us to this lesser-known gem!',
      status: 'published',
      date: '2025-05-02'
    },
    {
      name: 'David Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Singapore',
      rating: 5,
      message: 'The Kashmir Bliss tour exceeded all our expectations. From the moment we landed until departure, everything was perfectly arranged. The Mughal Gardens were stunning, and the shikara ride on Dal Lake was so peaceful. Highly recommend!',
      status: 'published',
      date: '2025-04-28'
    },
    {
      name: 'Neha Patel',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Ahmedabad, India',
      rating: 4,
      message: 'Our family trip to Jammu and Vaishno Devi was a beautiful spiritual experience. The hotel arrangements were excellent, and our guide was very helpful. The only suggestion would be to include more meal options in the package.',
      status: 'published',
      date: '2025-04-20'
    },
    {
      name: 'Michael Thompson',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Sydney, Australia',
      rating: 5,
      message: 'As a photographer, the landscapes of Ladakh were a dream come true. Our guide knew exactly where to take us for the best shots at the perfect time of day. The team was flexible with our schedule and accommodated all our requests.',
      status: 'published',
      date: '2025-04-15'
    },
    {
      name: 'Sanjay Mehta',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Bengaluru, India',
      rating: 5,
      message: 'The Kashmir Bliss tour exceeded all expectations. The houseboat experience on Dal Lake was magical, and our guide was incredibly knowledgeable. Will definitely recommend to friends and family!',
      status: 'pending',
      date: '2025-06-01'
    },
    {
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      location: 'Manchester, UK',
      rating: 4,
      message: 'Our Ladakh trip was incredible. The landscapes are out of this world. Only feedback would be that some accommodations could be improved, but overall an amazing adventure.',
      status: 'pending',
      date: '2025-06-02'
    }
  ];

  let count = 0;
  for (const testimonial of testimonials) {
    const query = `INSERT INTO testimonials (
      name, avatar, location, rating, message, status, date
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    if (executeQuery(query, [
      testimonial.name,
      testimonial.avatar,
      testimonial.location,
      testimonial.rating,
      testimonial.message,
      testimonial.status,
      testimonial.date
    ])) {
      count++;
    }
  }
  
  console.log(`Added ${count} testimonials`);
}

// Helper function to save database to localStorage
function saveToLocalStorage() {
  try {
    const data = db.export();
    const binary = new Uint8Array(data);
    
    // Convert to base64 for storage
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(binary)));
    localStorage.setItem('jklg_database', base64);
    
    console.log('Database saved to localStorage successfully');
    return true;
  } catch (error) {
    console.error('Error saving database to localStorage:', error);
    return false;
  }
}

// Run all seed functions
async function seedAll() {
  try {
    console.log('Starting database seeding...');
    
    // Initialize the database
    const initialized = await initDatabase();
    if (!initialized) {
      console.error('Failed to initialize database');
      return;
    }
    
    // Clear existing data first
    clearDatabase();
    
    // Seed all tables
    seedFAQs();
    seedDestinations();
    seedPackagesAndItineraries();
    seedGallery();
    seedAdminUsers();
    seedBookings();
    seedSupportTickets();
    seedBlogPosts();
    seedTestimonials();
    
    // Save the database to localStorage
    saveToLocalStorage();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seed script
seedAll();