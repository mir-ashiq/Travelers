/*
  # Seed data for JKLG Travel Agency

  This migration populates the database with initial data for:
  - FAQs
  - Support Tickets
  - Ticket Messages
  - Destinations
  - Packages
  - Itineraries
  - Gallery
  - Admin Users
  - Bookings
  - Blog Posts
  - Testimonials
*/

-- Seed FAQs
INSERT INTO faqs (question, answer, category, published)
VALUES
  ('What is the best time to visit Kashmir?', 'The best time to visit Kashmir is from April to October. Spring (April to June) offers blooming gardens, summer (July to August) has pleasant weather, and autumn (September to October) showcases golden landscapes.', 'General', TRUE),
  ('Do I need special permits for Ladakh?', 'Yes, certain areas in Ladakh require Inner Line Permits (ILP). Our tour packages include obtaining these permits for you, so you don''t need to worry about the process.', 'Permits & Documentation', TRUE),
  ('How do I book a tour package?', 'You can book a tour package by filling out the booking form on the package detail page or by contacting us directly via phone or email. No advance payment is required for booking.', 'Booking', TRUE),
  ('What is your cancellation policy?', 'Our cancellation policy depends on how far in advance you cancel. Cancellations made 30+ days before the trip receive a full refund minus processing fees. Cancellations 15-29 days prior receive a 75% refund, 7-14 days prior receive a 50% refund, and less than 7 days receive no refund.', 'Booking', TRUE),
  ('Do you offer customized tour packages?', 'Yes, we offer customized tour packages tailored to your preferences, budget, and time constraints. Contact us with your requirements, and we''ll create a personalized itinerary for you.', 'Packages', TRUE),
  ('What type of accommodations do you provide?', 'We offer a range of accommodations based on the package you choose, from luxury houseboats and 5-star hotels to mid-range hotels and budget-friendly guesthouses. All accommodations are carefully selected to ensure comfort and quality.', 'Accommodations', TRUE),
  ('Is it safe to travel to Kashmir and Ladakh?', 'Yes, the tourist areas of Kashmir and Ladakh are safe for travelers. We prioritize the safety of our guests and continuously monitor local conditions. Our guides are well-informed about the regions and safety protocols.', 'Safety', FALSE);

-- Seed Support Tickets and Messages
INSERT INTO support_tickets (id, subject, customer, email, status, priority, category, created_at, assigned_to, last_update)
VALUES
  (1001, 'Cancellation request for Kashmir Bliss Package', 'Rahul Sharma', 'rahul.s@example.com', 'Open', 'High', 'Booking', '2025-06-01 14:30:00', 'Zara Khan', '2025-06-01 14:30:00'),
  (1002, 'Request for customization of Ladakh itinerary', 'Priya Singh', 'priya.s@example.com', 'In Progress', 'Medium', 'Customization', '2025-05-30 11:15:00', 'Priya Kaul', '2025-05-31 09:45:00'),
  (1003, 'Query regarding Gurez Valley tour prerequisites', 'Ajay Patel', 'ajay.p@example.com', 'Closed', 'Low', 'Information', '2025-05-25 16:20:00', 'Raj Gupta', '2025-05-27 10:10:00'),
  (1004, 'Issue with payment for booking #3042', 'Sarah Wilson', 'sarah.w@example.com', 'Open', 'High', 'Payment', '2025-06-02 08:15:00', NULL, '2025-06-02 08:15:00');

-- Reset sequence to continue after our explicitly set IDs
SELECT setval('support_tickets_id_seq', 1004, true);

INSERT INTO ticket_messages (ticket_id, from_type, name, message, created_at)
VALUES
  (1001, 'customer', 'Rahul Sharma', 'I need to cancel my Kashmir Bliss tour package booking due to a family emergency. The booking was made last week for travel dates June 15-20, 2025. Please confirm the cancellation policy and the amount that will be refunded.', '2025-06-01 14:30:00'),
  (1002, 'customer', 'Priya Singh', 'I am interested in the Ladakh Adventure package but would like to add an extra day for acclimatization and also include a visit to Tso Moriri lake. Is this possible and what would be the additional cost?', '2025-05-30 11:15:00'),
  (1002, 'agent', 'Priya Kaul', 'Hello Priya, thank you for your interest in our Ladakh Adventure package. Yes, we can definitely customize the itinerary to include an extra day for acclimatization and a visit to Tso Moriri lake. The additional cost would be approximately ₹8,000 per person. Would you like me to prepare a detailed customized itinerary for you?', '2025-05-30 14:30:00'),
  (1002, 'customer', 'Priya Singh', 'That sounds good. Yes, please prepare a detailed itinerary with the changes. Also, would we need any additional permits for Tso Moriri?', '2025-05-31 09:45:00'),
  (1003, 'customer', 'Ajay Patel', 'I am planning to book the Gurez Valley Explorer tour. Are there any specific permits required for Indian citizens? Also, what is the mobile network availability in the region?', '2025-05-25 16:20:00'),
  (1003, 'agent', 'Raj Gupta', 'Hello Ajay, thank you for your interest in our Gurez Valley Explorer tour. For Indian citizens, a valid government ID proof is sufficient. However, foreign nationals require an Inner Line Permit. Regarding mobile connectivity, only BSNL network works in some parts of Gurez Valley. We recommend informing your family about limited connectivity during the tour. Let me know if you have any other questions!', '2025-05-26 09:30:00'),
  (1003, 'customer', 'Ajay Patel', 'Thank you for the information. This is really helpful. I will proceed with the booking soon.', '2025-05-26 15:45:00'),
  (1003, 'agent', 'Raj Gupta', 'You are welcome, Ajay! We are excited to have you experience the beautiful Gurez Valley. Feel free to reach out if you have any other questions or when you are ready to book.', '2025-05-27 10:10:00'),
  (1004, 'customer', 'Sarah Wilson', 'I tried to make a payment for my booking #3042 (Jammu Heritage Tour) but the transaction failed twice. However, the amount was debited from my account both times. Please help resolve this issue as soon as possible.', '2025-06-02 08:15:00');

-- Seed Destinations
INSERT INTO destinations (name, region, description, image, featured)
VALUES
  ('Dal Lake', 'Kashmir', 'Known as the "Jewel in the crown of Kashmir", Dal Lake is famous for its houseboats and floating gardens.', 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', TRUE),
  ('Gulmarg', 'Kashmir', 'A premier ski destination with breathtaking meadows, Gulmarg offers stunning views of snow-capped mountains.', 'https://images.pexels.com/photos/4254554/pexels-photo-4254554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', TRUE),
  ('Pangong Lake', 'Ladakh', 'This stunning high-altitude lake changes colors throughout the day and is surrounded by barren mountains.', 'https://images.pexels.com/photos/37057/scooter-india-nomad-landscape.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', TRUE),
  ('Nubra Valley', 'Ladakh', 'Known for its orchards, rare double-humped camels and dramatic landscapes.', 'https://images.pexels.com/photos/9726393/pexels-photo-9726393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', TRUE),
  ('Gurez Valley', 'Gurez', 'A remote and untouched valley with pristine beauty, traditional villages, and stunning mountain views.', 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', TRUE),
  ('Vaishno Devi', 'Jammu', 'One of the most revered Hindu pilgrimage sites, nestled in the Trikuta Mountains.', 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', TRUE),
  ('Sonamarg', 'Kashmir', 'Meaning "Meadow of Gold", Sonamarg offers breathtaking vistas of snow-clad mountains and glaciers.', 'https://images.pexels.com/photos/12918978/pexels-photo-12918978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', FALSE),
  ('Leh Palace', 'Ladakh', 'A former royal palace with a striking resemblance to the Potala Palace in Tibet.', 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', FALSE);

-- Seed Packages with Itineraries
INSERT INTO packages (id, title, description, price, duration, image, destinations, featured, rating, accommodations, included, excluded)
VALUES
  (1, 'Kashmir Bliss: 6 Days Tour', 'Experience the pristine beauty of Kashmir with visits to Srinagar, Gulmarg, and Pahalgam. Enjoy shikara rides, stunning gardens, and snow-capped mountains.', 24999, 6, 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Srinagar', 'Gulmarg', 'Pahalgam'], TRUE, 4.8, 'Luxury houseboats and 4-star hotels', ARRAY['Airport transfers', 'Accommodation', 'Daily breakfast and dinner', 'Sightseeing as per itinerary', 'English-speaking guide', 'All applicable taxes'], ARRAY['Airfare', 'Lunch', 'Personal expenses', 'Travel insurance', 'Optional activities']),
  (2, 'Ladakh Adventure: 8 Days Tour', 'Embark on an adventure through the stunning landscapes of Ladakh. Visit Leh, Nubra Valley, Pangong Lake, and more.', 34999, 8, 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Leh', 'Nubra Valley', 'Pangong Lake', 'Khardung La'], TRUE, 4.9, '3-star hotels and luxury camps', ARRAY['Airport transfers', 'Accommodation', 'All meals', 'Sightseeing as per itinerary', 'Inner Line Permits', 'English-speaking guide', 'All applicable taxes'], ARRAY['Airfare', 'Personal expenses', 'Travel insurance', 'Optional activities']),
  (3, 'Gurez Valley Explorer: 5 Days Tour', 'Discover the untouched beauty of Gurez Valley, one of Kashmir''s hidden gems with pristine landscapes and rich culture.', 22999, 5, 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Srinagar', 'Gurez Valley', 'Dawar'], TRUE, 4.7, '3-star hotels and guesthouses', ARRAY['Airport transfers', 'Accommodation', 'All meals', 'Sightseeing as per itinerary', 'Permits', 'English-speaking guide', 'All applicable taxes'], ARRAY['Airfare', 'Personal expenses', 'Travel insurance', 'Optional activities']),
  (4, 'Jammu Heritage Tour: 4 Days', 'Explore the rich cultural heritage of Jammu with visits to temples, palaces, and natural wonders.', 18999, 4, 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', ARRAY['Jammu', 'Vaishno Devi', 'Patnitop'], TRUE, 4.6, '3-star and 4-star hotels', ARRAY['Airport transfers', 'Accommodation', 'Daily breakfast', 'Sightseeing as per itinerary', 'English-speaking guide', 'All applicable taxes'], ARRAY['Airfare', 'Lunch and dinner', 'Personal expenses', 'Travel insurance', 'Optional activities', 'Helicopter tickets for Vaishno Devi']);

-- Reset sequence to continue after our explicitly set IDs
SELECT setval('packages_id_seq', 4, true);

-- Seed Itineraries
INSERT INTO itineraries (package_id, day, title, description)
VALUES
  -- Kashmir Bliss
  (1, 1, 'Arrival in Srinagar', 'Arrive at Srinagar Airport and transfer to your houseboat on Dal Lake. Enjoy a relaxing shikara ride in the evening.'),
  (1, 2, 'Srinagar City Tour', 'Visit Mughal Gardens, Shankaracharya Temple, and local markets. Enjoy another night on the houseboat.'),
  (1, 3, 'Gulmarg Excursion', 'Full-day excursion to Gulmarg. Enjoy the Gondola ride (optional) and panoramic views of the Himalayas.'),
  (1, 4, 'Pahalgam Visit', 'Drive to Pahalgam, visiting Avantipura ruins and saffron fields en route. Check-in at hotel in Pahalgam.'),
  (1, 5, 'Pahalgam Exploration', 'Explore the beautiful valleys of Aru, Betaab, and Chandanwari (subject to weather conditions).'),
  (1, 6, 'Departure', 'Return to Srinagar and transfer to the airport for your departure flight.'),
  
  -- Ladakh Adventure
  (2, 1, 'Arrival in Leh', 'Arrive at Leh Airport and transfer to your hotel. Rest for acclimatization.'),
  (2, 2, 'Leh Local Sightseeing', 'Visit Shanti Stupa, Leh Palace, and Namgyal Tsemo Monastery.'),
  (2, 3, 'Leh to Nubra Valley', 'Drive to Nubra Valley via Khardung La (one of the highest motorable roads). Visit Diskit Monastery and Hunder sand dunes.'),
  (2, 4, 'Nubra Valley to Pangong Lake', 'Drive to Pangong Lake via Shyok river route. Enjoy the mesmerizing views of the changing colors of the lake.'),
  (2, 5, 'Pangong Lake to Leh', 'Return to Leh via Chang La pass, visiting Thiksey Monastery en route.'),
  (2, 6, 'Excursion to Alchi and Lamayuru', 'Day trip to Alchi and Lamayuru monasteries, some of the oldest in Ladakh.'),
  (2, 7, 'Leh Leisure Day', 'Free day for shopping and relaxation in Leh.'),
  (2, 8, 'Departure', 'Transfer to Leh Airport for your departure flight.'),
  
  -- Gurez Valley
  (3, 1, 'Arrival in Srinagar', 'Arrive at Srinagar Airport and transfer to your hotel. Evening at leisure.'),
  (3, 2, 'Srinagar to Gurez Valley', 'Drive to Gurez Valley via Razdan Pass. Check-in at guesthouse in Dawar.'),
  (3, 3, 'Exploring Gurez Valley', 'Visit Habba Khatoon Peak, Tulail Valley, and traditional Dard-Shin villages.'),
  (3, 4, 'Gurez to Srinagar', 'Return to Srinagar. Evening at leisure for shopping.'),
  (3, 5, 'Departure', 'Transfer to Srinagar Airport for your departure flight.'),
  
  -- Jammu Heritage
  (4, 1, 'Arrival in Jammu', 'Arrive at Jammu Airport and transfer to your hotel. Visit Raghunath Temple and Bahu Fort.'),
  (4, 2, 'Jammu to Katra', 'Drive to Katra, the base for Vaishno Devi pilgrimage. Check-in at hotel and prepare for the trek.'),
  (4, 3, 'Vaishno Devi Darshan', 'Early morning trek to Vaishno Devi Temple (optional helicopter service available). Return to Katra in evening.'),
  (4, 4, 'Departure', 'Return to Jammu and transfer to the airport for your departure flight.');

-- Seed Gallery
INSERT INTO gallery (title, location, image)
VALUES
  ('Dal Lake Sunset', 'Srinagar, Kashmir', 'https://images.pexels.com/photos/7680353/pexels-photo-7680353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Gulmarg Snowscape', 'Gulmarg, Kashmir', 'https://images.pexels.com/photos/4254554/pexels-photo-4254554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Pangong Lake Reflections', 'Ladakh', 'https://images.pexels.com/photos/15769401/pexels-photo-15769401/free-photo-of-landscape-with-mountains-lake-and-snow.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Nubra Valley Serenity', 'Nubra Valley, Ladakh', 'https://images.pexels.com/photos/9726393/pexels-photo-9726393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Gurez Valley Panorama', 'Gurez Valley', 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Vaishno Devi Temple', 'Jammu', 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Tulip Gardens', 'Srinagar, Kashmir', 'https://images.pexels.com/photos/4094269/pexels-photo-4094269.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Magnetic Hill', 'Ladakh', 'https://images.pexels.com/photos/13580526/pexels-photo-13580526.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Betaab Valley', 'Pahalgam, Kashmir', 'https://images.pexels.com/photos/13326901/pexels-photo-13326901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Zanskar River', 'Ladakh', 'https://images.pexels.com/photos/14194994/pexels-photo-14194994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Leh Palace', 'Leh, Ladakh', 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
  ('Shalimar Garden', 'Srinagar, Kashmir', 'https://images.pexels.com/photos/12918978/pexels-photo-12918978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');

-- Seed Admin Users
INSERT INTO admin_users (name, email, phone, role, avatar, status, last_login)
VALUES
  ('Aarav Sharma', 'aarav.s@jklgtravel.com', '+91 9876543210', 'Admin', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', 'Active', '2025-06-01 14:30:00'),
  ('Priya Kaul', 'priya.k@jklgtravel.com', '+91 9876543211', 'Manager', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', 'Active', '2025-06-01 09:45:00'),
  ('Raj Gupta', 'raj.g@jklgtravel.com', '+91 9876543212', 'Guide', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100', 'Active', '2025-05-30 11:20:00'),
  ('Zara Khan', 'zara.k@jklgtravel.com', '+91 9876543213', 'Support', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', 'Active', '2025-06-01 16:10:00'),
  ('Arjun Patel', 'arjun.p@jklgtravel.com', '+91 9876543214', 'Guide', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100', 'Inactive', '2025-05-15 10:30:00');

-- Seed Bookings
INSERT INTO bookings (id, name, email, phone, package, travel_date, booking_date, amount, status, message, payment_status, source, assigned_to)
VALUES
  (1, 'Rahul Sharma', 'rahul.s@example.com', '+91 9876543210', 'Kashmir Bliss: 6 Days Tour', '2025-06-10', '2025-05-01', 24999, 'Pending', 'Looking forward to this trip! We are a family of 4.', 'Paid', 'Website', 'Priya Kaul'),
  (2, 'Priya Singh', 'priya.s@example.com', '+91 9876543211', 'Ladakh Adventure: 8 Days Tour', '2025-06-15', '2025-05-03', 34999, 'Confirmed', 'Please arrange for vegetarian meals. Excited for the trip!', 'Paid', 'Mobile App', 'Raj Gupta'),
  (3, 'Ajay Patel', 'ajay.p@example.com', '+91 9876543212', 'Gurez Valley Explorer: 5 Days Tour', '2025-06-12', '2025-05-02', 22999, 'Pending', 'I have some questions about the accommodation. Please call me.', 'Pending', 'Phone Inquiry', NULL),
  (4, 'Sarah Wilson', 'sarah.w@example.com', '+44 7911123456', 'Jammu Heritage Tour: 4 Days', '2025-06-18', '2025-04-30', 18999, 'Confirmed', 'This is our first trip to India. Looking forward to it!', 'Paid', 'Partner Agency', 'Aarav Sharma'),
  (5, 'Vikram Mehta', 'vikram.m@example.com', '+91 9876543213', 'Kashmir Bliss: 6 Days Tour', '2025-07-05', '2025-05-10', 24999, 'Cancelled', 'Had to cancel due to a family emergency.', 'Refunded', 'Website', 'Zara Khan'),
  (6, 'Neha Gupta', 'neha.g@example.com', '+91 9876543214', 'Ladakh Adventure: 8 Days Tour', '2025-07-20', '2025-05-15', 34999, 'Confirmed', 'Please include a birthday surprise for my husband on July 22nd.', 'Paid', 'Website', 'Priya Kaul'),
  (7, 'James Thompson', 'james.t@example.com', '+1 2025550182', 'Gurez Valley Explorer: 5 Days Tour', '2025-08-10', '2025-05-20', 22999, 'Pending', 'Will there be English speaking guides available?', 'Pending', 'Partner Agency', 'Raj Gupta');

-- Reset sequence to continue after our explicitly set IDs
SELECT setval('bookings_id_seq', 7, true);

-- Seed Blog Posts
INSERT INTO blog_posts (title, excerpt, content, featured_image, author, date, category, tags, status, views)
VALUES
  ('Top 10 Must-Visit Places in Kashmir Valley', 'Discover the breathtaking beauty of Kashmir with our guide to the top 10 destinations that should be on every traveler''s bucket list.', 'Full blog content here...', 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=300', 'Priya Kaul', '2025-05-15', 'Destinations', ARRAY['Kashmir', 'Travel Guide', 'Sightseeing'], 'Published', 2456),
  ('A Beginner''s Guide to Trekking in Ladakh', 'Planning your first trek to Ladakh? Here''s everything you need to know about preparation, altitude sickness, best routes, and more.', 'Full blog content here...', 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=300', 'Raj Gupta', '2025-05-08', 'Adventure', ARRAY['Ladakh', 'Trekking', 'Adventure Sports'], 'Published', 1832),
  ('Cultural Heritage of Jammu: Beyond the Temples', 'Explore the rich cultural heritage of Jammu region, from ancient forts to traditional crafts and cuisine.', 'Full blog content here...', 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=300', 'Aarav Sharma', '2025-04-27', 'Culture', ARRAY['Jammu', 'Cultural Heritage', 'History'], 'Published', 1245),
  ('The Hidden Gem of Kashmir: Exploring Gurez Valley', 'Journey with us as we take you through the untouched beauty of Gurez Valley, one of Kashmir''s best-kept secrets.', 'Full blog content here...', 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=300', 'Zara Khan', '2025-04-20', 'Off the Beaten Path', ARRAY['Gurez', 'Hidden Gems', 'Kashmir'], 'Published', 983),
  ('Sustainable Tourism in Kashmir: How to Travel Responsibly', 'Learn how to minimize your environmental impact while traveling in Kashmir and contribute positively to local communities.', 'Full blog content here...', 'https://images.pexels.com/photos/7680353/pexels-photo-7680353.jpeg?auto=compress&cs=tinysrgb&w=300', 'Priya Kaul', '2025-05-30', 'Sustainable Travel', ARRAY['Eco-friendly', 'Sustainable Tourism', 'Responsible Travel'], 'Draft', 0);

-- Seed Testimonials
INSERT INTO testimonials (name, avatar, location, rating, message, status, date)
VALUES
  ('Priya Sharma', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100', 'Delhi, India', 5, 'Our trip to Kashmir was absolutely magical! The houseboat stay on Dal Lake was an unforgettable experience. The team at JKLG Travel took care of everything and made our honeymoon truly special.', 'published', '2025-06-05'),
  ('James Wilson', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100', 'London, UK', 5, 'Ladakh was on my bucket list for years, and JKLG Travel made it happen perfectly. The itinerary was well-planned, accommodations were comfortable, and our guide was incredibly knowledgeable. Pangong Lake was even more beautiful than in pictures!', 'published', '2025-06-04'),
  ('Aisha Khan', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mumbai, India', 4, 'We took the Gurez Valley Explorer tour and were blown away by the untouched beauty of the region. It felt like we had discovered a hidden paradise. Thank you for introducing us to this lesser-known gem!', 'published', '2025-06-03'),
  ('David Chen', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', 'Singapore', 5, 'The Kashmir Bliss tour exceeded all our expectations. From the moment we landed until departure, everything was perfectly arranged. The Mughal Gardens were stunning, and the shikara ride on Dal Lake was so peaceful. Highly recommend!', 'published', '2025-06-02'),
  ('Neha Patel', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', 'Ahmedabad, India', 4, 'Our family trip to Jammu and Vaishno Devi was a beautiful spiritual experience. The hotel arrangements were excellent, and our guide was very helpful. The only suggestion would be to include more meal options in the package.', 'published', '2025-06-01'),
  ('Michael Thompson', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', 'Sydney, Australia', 5, 'As a photographer, the landscapes of Ladakh were a dream come true. Our guide knew exactly where to take us for the best shots at the perfect time of day. The team was flexible with our schedule and accommodated all our requests.', 'published', '2025-05-31'),
  ('Sanjay Mehta', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100', 'Bengaluru, India', 5, 'The Kashmir Bliss tour exceeded all expectations. The houseboat experience on Dal Lake was magical, and our guide was incredibly knowledgeable. Will definitely recommend to friends and family!', 'pending', '2025-05-02'),
  ('Emma Wilson', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100', 'Manchester, UK', 4, 'Our Ladakh trip was incredible. The landscapes are out of this world. Only feedback would be that some accommodations could be improved, but overall an amazing adventure.', 'pending', '2025-05-03');