/*
  # Add Default Data

  1. New Data
    - Add initial destinations
    - Add initial tour packages and itineraries
    - Add initial gallery items
    - Add initial testimonials
    - Add sample support tickets and messages
    - Add sample bookings
    - Add admin users
    - Add FAQs
    - Add blog posts

  2. Security
    - No changes to security policies
*/

-- Populate destinations
INSERT INTO public.destinations (name, region, description, image, featured)
VALUES
  ('Dal Lake', 'Kashmir', 'Known as the "Jewel in the crown of Kashmir", Dal Lake is famous for its houseboats and floating gardens.', 'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true),
  ('Gulmarg', 'Kashmir', 'A premier ski destination with breathtaking meadows, Gulmarg offers stunning views of snow-capped mountains.', 'https://images.pexels.com/photos/4254554/pexels-photo-4254554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true),
  ('Pangong Lake', 'Ladakh', 'This stunning high-altitude lake changes colors throughout the day and is surrounded by barren mountains.', 'https://images.pexels.com/photos/37057/scooter-india-nomad-landscape.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true),
  ('Nubra Valley', 'Ladakh', 'Known for its orchards, rare double-humped camels and dramatic landscapes.', 'https://images.pexels.com/photos/9726393/pexels-photo-9726393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true),
  ('Gurez Valley', 'Gurez', 'A remote and untouched valley with pristine beauty, traditional villages, and stunning mountain views.', 'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true),
  ('Vaishno Devi', 'Jammu', 'One of the most revered Hindu pilgrimage sites, nestled in the Trikuta Mountains.', 'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', true),
  ('Sonamarg', 'Kashmir', 'Meaning "Meadow of Gold", Sonamarg offers breathtaking vistas of snow-clad mountains and glaciers.', 'https://images.pexels.com/photos/12918978/pexels-photo-12918978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', false),
  ('Leh Palace', 'Ladakh', 'A former royal palace with a striking resemblance to the Potala Palace in Tibet.', 'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', false);

-- Populate tour packages
INSERT INTO public.packages (title, description, price, duration, image, destinations, featured, rating, accommodations, included, excluded)
VALUES
  (
    'Kashmir Bliss: 6 Days Tour',
    'Experience the pristine beauty of Kashmir with visits to Srinagar, Gulmarg, and Pahalgam. Enjoy shikara rides, stunning gardens, and snow-capped mountains.',
    24999,
    6,
    'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['Srinagar', 'Gulmarg', 'Pahalgam'],
    true,
    4.8,
    'Luxury houseboats and 4-star hotels',
    ARRAY['Airport transfers', 'Accommodation', 'Daily breakfast and dinner', 'Sightseeing as per itinerary', 'English-speaking guide', 'All applicable taxes'],
    ARRAY['Airfare', 'Lunch', 'Personal expenses', 'Travel insurance', 'Optional activities']
  ),
  (
    'Ladakh Adventure: 8 Days Tour',
    'Embark on an adventure through the stunning landscapes of Ladakh. Visit Leh, Nubra Valley, Pangong Lake, and more.',
    34999,
    8,
    'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['Leh', 'Nubra Valley', 'Pangong Lake', 'Khardung La'],
    true,
    4.9,
    '3-star hotels and luxury camps',
    ARRAY['Airport transfers', 'Accommodation', 'All meals', 'Sightseeing as per itinerary', 'Inner Line Permits', 'English-speaking guide', 'All applicable taxes'],
    ARRAY['Airfare', 'Personal expenses', 'Travel insurance', 'Optional activities']
  ),
  (
    'Gurez Valley Explorer: 5 Days Tour',
    'Discover the untouched beauty of Gurez Valley, one of Kashmir''s hidden gems with pristine landscapes and rich culture.',
    22999,
    5,
    'https://images.pexels.com/photos/4254547/pexels-photo-4254547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['Srinagar', 'Gurez Valley', 'Dawar'],
    true,
    4.7,
    '3-star hotels and guesthouses',
    ARRAY['Airport transfers', 'Accommodation', 'All meals', 'Sightseeing as per itinerary', 'Permits', 'English-speaking guide', 'All applicable taxes'],
    ARRAY['Airfare', 'Personal expenses', 'Travel insurance', 'Optional activities']
  ),
  (
    'Jammu Heritage Tour: 4 Days',
    'Explore the rich cultural heritage of Jammu with visits to temples, palaces, and natural wonders.',
    18999,
    4,
    'https://images.pexels.com/photos/8250698/pexels-photo-8250698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['Jammu', 'Vaishno Devi', 'Patnitop'],
    true,
    4.6,
    '3-star and 4-star hotels',
    ARRAY['Airport transfers', 'Accommodation', 'Daily breakfast', 'Sightseeing as per itinerary', 'English-speaking guide', 'All applicable taxes'],
    ARRAY['Airfare', 'Lunch and dinner', 'Personal expenses', 'Travel insurance', 'Optional activities', 'Helicopter tickets for Vaishno Devi']
  );

-- Populate itineraries for Kashmir Bliss Tour (ID 1)
INSERT INTO public.itineraries (package_id, day, title, description)
VALUES
  (1, 1, 'Arrival in Srinagar', 'Arrive at Srinagar Airport and transfer to your houseboat on Dal Lake. Enjoy a relaxing shikara ride in the evening.'),
  (1, 2, 'Srinagar City Tour', 'Visit Mughal Gardens, Shankaracharya Temple, and local markets. Enjoy another night on the houseboat.'),
  (1, 3, 'Gulmarg Excursion', 'Full-day excursion to Gulmarg. Enjoy the Gondola ride (optional) and panoramic views of the Himalayas.'),
  (1, 4, 'Pahalgam Visit', 'Drive to Pahalgam, visiting Avantipura ruins and saffron fields en route. Check-in at hotel in Pahalgam.'),
  (1, 5, 'Pahalgam Exploration', 'Explore the beautiful valleys of Aru, Betaab, and Chandanwari (subject to weather conditions).'),
  (1, 6, 'Departure', 'Return to Srinagar and transfer to the airport for your departure flight.');

-- Populate itineraries for Ladakh Adventure Tour (ID 2)
INSERT INTO public.itineraries (package_id, day, title, description)
VALUES
  (2, 1, 'Arrival in Leh', 'Arrive at Leh Airport and transfer to your hotel. Rest for acclimatization.'),
  (2, 2, 'Leh Local Sightseeing', 'Visit Shanti Stupa, Leh Palace, and Namgyal Tsemo Monastery.'),
  (2, 3, 'Leh to Nubra Valley', 'Drive to Nubra Valley via Khardung La (one of the highest motorable roads). Visit Diskit Monastery and Hunder sand dunes.'),
  (2, 4, 'Nubra Valley to Pangong Lake', 'Drive to Pangong Lake via Shyok river route. Enjoy the mesmerizing views of the changing colors of the lake.'),
  (2, 5, 'Pangong Lake to Leh', 'Return to Leh via Chang La pass, visiting Thiksey Monastery en route.'),
  (2, 6, 'Excursion to Alchi and Lamayuru', 'Day trip to Alchi and Lamayuru monasteries, some of the oldest in Ladakh.'),
  (2, 7, 'Leh Leisure Day', 'Free day for shopping and relaxation in Leh.'),
  (2, 8, 'Departure', 'Transfer to Leh Airport for your departure flight.');

-- Populate itineraries for Gurez Valley Tour (ID 3)
INSERT INTO public.itineraries (package_id, day, title, description)
VALUES
  (3, 1, 'Arrival in Srinagar', 'Arrive at Srinagar Airport and transfer to your hotel. Evening at leisure.'),
  (3, 2, 'Srinagar to Gurez Valley', 'Drive to Gurez Valley via Razdan Pass. Check-in at guesthouse in Dawar.'),
  (3, 3, 'Exploring Gurez Valley', 'Visit Habba Khatoon Peak, Tulail Valley, and traditional Dard-Shin villages.'),
  (3, 4, 'Gurez to Srinagar', 'Return to Srinagar. Evening at leisure for shopping.'),
  (3, 5, 'Departure', 'Transfer to Srinagar Airport for your departure flight.');

-- Populate itineraries for Jammu Heritage Tour (ID 4)
INSERT INTO public.itineraries (package_id, day, title, description)
VALUES
  (4, 1, 'Arrival in Jammu', 'Arrive at Jammu Airport and transfer to your hotel. Visit Raghunath Temple and Bahu Fort.'),
  (4, 2, 'Jammu to Katra', 'Drive to Katra, the base for Vaishno Devi pilgrimage. Check-in at hotel and prepare for the trek.'),
  (4, 3, 'Vaishno Devi Darshan', 'Early morning trek to Vaishno Devi Temple (optional helicopter service available). Return to Katra in evening.'),
  (4, 4, 'Departure', 'Return to Jammu and transfer to the airport for your departure flight.');

-- Populate gallery
INSERT INTO public.gallery (title, location, image)
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

-- Populate testimonials
INSERT INTO public.testimonials (name, avatar, location, rating, message, status, date)
VALUES
  ('Priya Sharma', 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100', 'Delhi, India', 5, 'Our trip to Kashmir was absolutely magical! The houseboat stay on Dal Lake was an unforgettable experience. The team at JKLG Travel took care of everything and made our honeymoon truly special.', 'published', '2025-05-15'),
  ('James Wilson', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100', 'London, UK', 5, 'Ladakh was on my bucket list for years, and JKLG Travel made it happen perfectly. The itinerary was well-planned, accommodations were comfortable, and our guide was incredibly knowledgeable. Pangong Lake was even more beautiful than in pictures!', 'published', '2025-05-10'),
  ('Aisha Khan', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', 'Mumbai, India', 4, 'We took the Gurez Valley Explorer tour and were blown away by the untouched beauty of the region. It felt like we had discovered a hidden paradise. Thank you for introducing us to this lesser-known gem!', 'published', '2025-05-02'),
  ('David Chen', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', 'Singapore', 5, 'The Kashmir Bliss tour exceeded all our expectations. From the moment we landed until departure, everything was perfectly arranged. The Mughal Gardens were stunning, and the shikara ride on Dal Lake was so peaceful. Highly recommend!', 'published', '2025-04-28'),
  ('Neha Patel', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', 'Ahmedabad, India', 4, 'Our family trip to Jammu and Vaishno Devi was a beautiful spiritual experience. The hotel arrangements were excellent, and our guide was very helpful. The only suggestion would be to include more meal options in the package.', 'published', '2025-04-20'),
  ('Michael Thompson', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', 'Sydney, Australia', 5, 'As a photographer, the landscapes of Ladakh were a dream come true. Our guide knew exactly where to take us for the best shots at the perfect time of day. The team was flexible with our schedule and accommodated all our requests.', 'published', '2025-04-15');

-- Add admin users
INSERT INTO public.admin_users (name, email, phone, role, avatar, status)
VALUES
  ('Admin User', 'admin@jklgtravel.com', '+91 98765 43210', 'Admin', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32', 'Active'),
  ('Priya Kaul', 'priya@jklgtravel.com', '+91 98765 43211', 'Manager', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=32', 'Active'),
  ('Raj Gupta', 'raj@jklgtravel.com', '+91 98765 43212', 'Guide', 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32', 'Active'),
  ('Zara Khan', 'zara@jklgtravel.com', '+91 98765 43213', 'Support', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=32', 'Active');

-- Add sample bookings
INSERT INTO public.bookings (name, email, phone, package, travel_date, booking_date, amount, status, message, payment_status, source)
VALUES
  ('Rahul Sharma', 'rahul.sharma@example.com', '+91 98765 43214', 'Kashmir Bliss: 6 Days Tour', '2025-07-15', '2025-06-01', 24999, 'Confirmed', 'Looking forward to the trip!', 'Paid', 'Website'),
  ('Priya Singh', 'priya.singh@example.com', '+91 98765 43215', 'Ladakh Adventure: 8 Days Tour', '2025-07-20', '2025-06-02', 34999, 'Confirmed', 'Please arrange for vegetarian meals.', 'Paid', 'Website'),
  ('Ajay Patel', 'ajay.patel@example.com', '+91 98765 43216', 'Gurez Valley Explorer: 5 Days Tour', '2025-07-18', '2025-06-01', 22999, 'Pending', 'Would like to know more about the local attractions.', 'Pending', 'Phone'),
  ('Sarah Wilson', 'sarah.wilson@example.com', '+44 7911 123456', 'Jammu Heritage Tour: 4 Days', '2025-08-05', '2025-06-03', 18999, 'Confirmed', 'First time visiting India, very excited!', 'Paid', 'Website'),
  ('David Lee', 'david.lee@example.com', '+65 9123 4567', 'Ladakh Adventure: 8 Days Tour', '2025-08-10', '2025-06-04', 34999, 'Pending', 'I have altitude sickness concerns, can we discuss?', 'Pending', 'Email');

-- Add sample support tickets
INSERT INTO public.support_tickets (subject, customer, email, status, priority, category, assigned_to, last_update)
VALUES
  ('Question about Kashmir Bliss Tour', 'Rahul Sharma', 'rahul.sharma@example.com', 'Open', 'Medium', 'Information', NULL, '2025-06-01T10:30:00'),
  ('Need to change travel date', 'Priya Singh', 'priya.singh@example.com', 'In Progress', 'High', 'Booking', 'Zara Khan', '2025-06-02T14:15:00'),
  ('Requesting vegetarian meal option', 'Ajay Patel', 'ajay.patel@example.com', 'Open', 'Low', 'Customization', NULL, '2025-06-01T16:45:00'),
  ('Issue with payment', 'Sarah Wilson', 'sarah.wilson@example.com', 'Closed', 'High', 'Payment', 'Priya Kaul', '2025-06-03T09:20:00');

-- Add sample ticket messages
INSERT INTO public.ticket_messages (ticket_id, from_type, name, message)
VALUES
  (1, 'customer', 'Rahul Sharma', 'I would like to know if the Kashmir Bliss tour includes a visit to the Shankaracharya Temple?'),
  (2, 'customer', 'Priya Singh', 'Due to a family emergency, I need to reschedule my trip from July 20 to August 10. Is this possible?'),
  (2, 'agent', 'Zara Khan', 'Hello Priya, I understand your situation. Let me check the availability for August 10 and get back to you shortly.'),
  (3, 'customer', 'Ajay Patel', 'I am a strict vegetarian. Will all meals cater to vegetarian options during the Gurez Valley tour?'),
  (4, 'customer', 'Sarah Wilson', 'I made a payment but haven''t received a confirmation email yet.'),
  (4, 'agent', 'Priya Kaul', 'Hi Sarah, I can confirm we''ve received your payment. The confirmation email has been resent to your address. Please check your spam folder if you don''t see it.'),
  (4, 'customer', 'Sarah Wilson', 'Got it now, thank you!');

-- Add FAQs
INSERT INTO public.faqs (question, answer, category, published)
VALUES
  ('What is the best time to visit Kashmir?', 'The best time to visit Kashmir is from April to October. Spring (April to June) offers blooming gardens, summer (July to August) has pleasant weather, and autumn (September to October) showcases golden landscapes.', 'General', true),
  ('Do I need special permits for Ladakh?', 'Yes, certain areas in Ladakh require Inner Line Permits (ILP). Our tour packages include obtaining these permits for you, so you don''t need to worry about the process.', 'Travel Requirements', true),
  ('What type of accommodation is provided?', 'We offer a range of accommodations based on the package you choose, from luxury houseboats in Kashmir to comfortable hotels and camps in Ladakh. All accommodations are carefully selected for comfort, cleanliness, and authentic experience.', 'Accommodations', true),
  ('Is Gurez Valley safe to visit?', 'Yes, Gurez Valley is safe for tourists. However, as it''s a border area, there are certain regulations to follow. Our guides are well-versed with these regulations and will ensure a smooth experience.', 'Safety', true),
  ('How do I book a tour package?', 'You can book a tour package by filling out the booking form on the package detail page or by contacting us directly via phone or email. We require a 20% advance payment to confirm the booking.', 'Booking', true),
  ('What is your cancellation policy?', 'Our cancellation policy allows for a full refund if canceled 30 days before the trip, 50% refund if canceled 15-30 days before, and no refund for cancellations less than 15 days before the trip.', 'Policies', true);

-- Add blog posts
INSERT INTO public.blog_posts (title, excerpt, content, featured_image, author, date, category, tags, status, views)
VALUES
  (
    'Top 10 Must-Visit Places in Kashmir',
    'Discover the most beautiful locations in Kashmir that should be on every traveler''s bucket list.',
    'Kashmir, often referred to as "Paradise on Earth," is home to some of the most breathtaking landscapes in the world. From serene lakes to majestic mountains, here are the top 10 places you must visit when in Kashmir:

1. **Dal Lake**: The jewel in the crown of Kashmir, Dal Lake is famous for its houseboats and floating gardens (Rad). Experience the tranquility of a shikara ride at sunset.

2. **Gulmarg**: Known for its meadows and ski slopes, Gulmarg offers panoramic views of the surrounding mountains. Don''t miss the Gondola ride, one of the highest cable cars in the world.

3. **Pahalgam**: This picturesque town is situated at the confluence of Lidder River and Sheshnag Lake. It serves as the base camp for the Amarnath Yatra pilgrimage.

4. **Sonamarg**: Meaning "Meadow of Gold," Sonamarg is surrounded by snow-capped mountains and glaciers. The Thajiwas Glacier is a popular attraction here.

5. **Yusmarg**: A less crowded alternative to Gulmarg and Pahalgam, Yusmarg offers pristine beauty with meadows, forests, and mountains.

6. **Doodhpathri**: Known for its milky white water streams, Doodhpathri is a hidden gem with lush green meadows and pine forests.

7. **Betaab Valley**: Named after the Bollywood movie "Betaab" which was filmed here, this valley offers picturesque landscapes with the Lidder River flowing through.

8. **Tulip Garden**: The largest tulip garden in Asia, Indira Gandhi Memorial Tulip Garden in Srinagar showcases over 1.5 million tulips of various colors and varieties.

9. **Mughal Gardens**: The three main Mughal Gardens in Srinagar—Shalimar Bagh, Nishat Bagh, and Chashme Shahi—are masterpieces of Persian garden design.

10. **Wular Lake**: One of Asia''s largest freshwater lakes, Wular Lake offers a serene environment for boating and bird watching.

Each of these destinations offers a unique experience, showcasing different facets of Kashmir''s natural beauty and cultural richness. Whether you''re seeking adventure, relaxation, or cultural immersion, Kashmir has something for everyone.',
    'https://images.pexels.com/photos/11038549/pexels-photo-11038549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Aarav Sharma',
    '2025-05-15',
    'Travel Guide',
    ARRAY['Kashmir', 'Travel Tips', 'Destinations'],
    'Published',
    458
  ),
  (
    'Ladakh: A Photographer''s Paradise',
    'Exploring the best photography spots in Ladakh that will leave you with stunning shots and memorable experiences.',
    'Ladakh, with its stark landscapes, vivid monasteries, and unique culture, is a dream destination for photographers. Here''s a guide to the best photography spots in this high-altitude desert:

## Pangong Lake

The star attraction of Ladakh, Pangong Lake is famous for its changing colors throughout the day. For the best shots:
- Visit during early morning or late afternoon for the golden hour light
- Capture the contrast between the blue lake and barren mountains
- Use a polarizing filter to enhance the vibrant blue color
- Include the prayer flags in your composition for a cultural element

## Magnetic Hill

This optical illusion spot where vehicles appear to roll uphill is fascinating. Tips for shooting here:
- Create a time-lapse of vehicles seemingly defying gravity
- Capture the expansive landscapes surrounding the area
- Use a wide-angle lens to show the scale of the mountains

## Nubra Valley

Known for its white sand dunes and double-humped Bactrian camels:
- The best light is during sunrise and sunset when the dunes cast long shadows
- Shoot the camels against the backdrop of the Himalayan ranges
- Include local Ladakhi people in traditional attire for cultural context

## Monasteries

Thiksey, Hemis, and Diskit monasteries offer incredible architectural photography opportunities:
- Visit during morning prayer sessions for atmospheric shots with monks
- Capture the colorful interiors and detailed murals
- Use the monastery as a foreground element with mountains in the background
- Don''t miss the massive Buddha statues for scale photography

## Leh Palace

This nine-story palace offers panoramic views of Leh:
- Shoot from Shanti Stupa for a classic view of the palace against the mountain backdrop
- Explore the interior chambers for texture and light play photography
- Capture the palace at sunrise when the first light hits its façade

## Khardung La Pass

One of the highest motorable passes in the world:
- Capture prayer flags fluttering against the vast landscape
- Include signboards showing the altitude for context
- Photograph motorcycle enthusiasts who visit this iconic spot
- Be prepared for rapidly changing weather that can add drama to your shots

## Photography Tips for Ladakh

1. **Protect Your Gear**: The high altitude and dusty conditions can be challenging for camera equipment. Carry proper protection.
2. **Altitude Acclimatization**: Give yourself time to adjust before attempting strenuous photography sessions.
3. **Battery Conservation**: Cold temperatures drain batteries quickly. Keep spares in inner pockets to keep them warm.
4. **Lighting Conditions**: The clear air and high altitude create extreme contrast. Use graduated filters if needed.
5. **Respect Local Customs**: Always ask permission before photographing locals, especially in monasteries during ceremonies.
6. **Carry a Tripod**: Essential for low-light situations and star photography.
7. **Astrophotography**: Ladakh''s clear skies make it perfect for Milky Way photography.

Ladakh offers endless possibilities for photographers willing to brave the challenging conditions. The reward is unique images that capture one of the most distinctive landscapes on Earth.',
    'https://images.pexels.com/photos/15769417/pexels-photo-15769417/free-photo-of-mountains-in-leh-ladakh-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Zara Khan',
    '2025-05-10',
    'Photography',
    ARRAY['Ladakh', 'Photography', 'Travel Tips'],
    'Published',
    385
  ),
  (
    'Experiencing the Traditional Cuisine of Kashmir',
    'A culinary journey through the rich and flavorful traditional dishes of Kashmir.',
    'Kashmiri cuisine is an exquisite blend of aromatic spices, dried fruits, and slow-cooking techniques, influenced by Persian, Central Asian, and Mughal culinary traditions. Here''s a guide to the must-try dishes that define the region''s food culture:

## Wazwan: The Royal Feast

Wazwan is not just a meal but a ceremony, traditionally consisting of 36 courses, mostly meat-based. It''s prepared by specialized chefs called "wazas" and served at special occasions like weddings.

### Signature Wazwan Dishes:

- **Rogan Josh**: Tender lamb cooked with Kashmiri red chillies and aromatic spices
- **Tabak Maaz**: Crispy lamb ribs cooked in ghee
- **Gushtaba**: Minced meatballs cooked in a yogurt-based gravy, traditionally served as the final course
- **Rista**: Spicy meatballs in a fiery red gravy
- **Dhaniwal Korma**: Lamb cooked in a yogurt gravy with coriander
- **Aab Gosht**: Lamb cooked in a milk-based gravy

## Vegetarian Delights

Kashmiri Pandits have developed a rich tradition of vegetarian cuisine:

- **Dum Aloo**: Baby potatoes cooked in a spicy gravy
- **Haak**: A simple yet flavorful dish of collard greens
- **Chaman Kaliya**: Paneer (cottage cheese) in a turmeric-based yellow gravy
- **Nadru Yakhni**: Lotus stem in a yogurt-based gravy flavored with fennel

## Breads & Rice

- **Tsot**: A traditional Kashmiri bread similar to bagels
- **Girda**: Thick, disc-shaped bread with a crusty exterior
- **Lavas**: Soft, thin bread often served with tea
- **Modur Pulav**: Sweet rice with nuts, saffron, and dried fruits

## Beverages

- **Kehwa**: Aromatic green tea infused with cardamom, cinnamon, saffron, and almonds
- **Noon Chai (Pink Tea)**: Salted tea with milk, cardamom, and nuts
- **Sheer Chai**: A milky tea often served during winter

## Desserts

- **Phirni**: A rice pudding flavored with cardamom and saffron
- **Shufta**: A rich dessert of mixed dry fruits and paneer in sugar syrup

## Where to Experience Authentic Kashmiri Cuisine

1. **Ahdoo''s Restaurant (Srinagar)**: One of the oldest restaurants serving traditional Kashmiri cuisine since 1918
2. **Mughal Darbar (Srinagar)**: Famous for its wazwan and other Kashmiri specialties
3. **Shamyana Restaurant (Gulmarg)**: Offers a beautiful dining setting with authentic flavors
4. **Home Stays**: For the most authentic experience, nothing beats a meal in a Kashmiri home

## Cooking Techniques & Key Ingredients

The distinctive flavors of Kashmiri cuisine come from:

- **Saffron**: Used in many dishes for its aroma and golden color
- **Kashmiri Red Chilli**: Provides vibrant color without excessive heat
- **Fennel Seeds**: A key spice in many Kashmiri dishes
- **Dried Ginger (Soonth)**: Used as a warming spice
- **Asafoetida (Hing)**: For its distinctive flavor
- **Dry Fruits**: Almonds, walnuts, and dried fruits add richness

Whether you''re a meat lover or vegetarian, Kashmiri cuisine offers a rich tapestry of flavors that reflect the region''s history, climate, and cultural influences. Don''t miss the opportunity to experience this culinary tradition on your visit to Kashmir.',
    'https://images.pexels.com/photos/7680353/pexels-photo-7680353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Priya Kaul',
    '2025-05-05',
    'Food & Culture',
    ARRAY['Kashmir', 'Food', 'Culture', 'Cuisine'],
    'Published',
    312
  ),
  (
    'Planning Your First Trip to Jammu & Kashmir: Essential Tips',
    'A comprehensive guide for first-time visitors to Jammu & Kashmir with tips on planning, packing, and making the most of your journey.',
    'Jammu & Kashmir, with its diverse landscapes ranging from lush valleys to arid mountains, requires thoughtful planning for a successful trip. Here''s a comprehensive guide to help first-time visitors:

## Best Time to Visit

- **Spring (March-May)**: Ideal for witnessing blooming gardens and moderate temperatures
- **Summer (June-August)**: Perfect for Ladakh and high-altitude destinations
- **Autumn (September-October)**: Best for photography with golden landscapes and clear skies
- **Winter (November-February)**: Ideal for snow activities and winter sports in Gulmarg

## Travel Documentation

- **Indian Nationals**: A government-issued photo ID is sufficient
- **Foreign Nationals**: Valid passport and visa required
- **Inner Line Permits**: Required for certain areas in Ladakh (we arrange these for our tour packages)

## Transportation Options

- **By Air**: Direct flights to Srinagar, Jammu, and Leh from major Indian cities
- **By Train**: Railway stations in Jammu and Udhampur, followed by road travel
- **By Road**: Well-connected highway networks, but mountain roads can be challenging

## Packing Essentials

### For Kashmir Valley (Spring/Summer)
- Lightweight cotton clothes
- Light jacket or sweater for evenings
- Comfortable walking shoes
- Sun protection (hat, sunglasses, sunscreen)
- Rain protection during monsoon months

### For Ladakh
- Layered clothing (temperatures can vary drastically between day and night)
- Warm jacket even in summer
- High SPF sunscreen (UV radiation is strong at high altitudes)
- Lip balm and moisturizer (the air is extremely dry)
- Comfortable trekking shoes
- Medication for altitude sickness

### For Winter Trips
- Heavy woolen clothes
- Insulated and waterproof footwear
- Thermal innerwear
- Gloves, muffler, and woolen cap
- Moisturizer for dry skin

## Health Precautions

- **Altitude Sickness**: For Ladakh, allow 1-2 days for acclimatization upon arrival
- **Medications**: Carry personal medications along with basic first aid
- **Hydration**: Drink plenty of water, especially in Ladakh
- **Travel Insurance**: Highly recommended to cover emergency medical evacuation

## Cultural Etiquette

- Dress modestly, especially when visiting religious sites
- Remove shoes before entering temples, mosques, or homes
- Ask permission before photographing locals
- Respect local customs and traditions
- Bargain politely in markets but respect fair pricing

## Money Matters

- ATMs are available in major towns but may be limited in remote areas
- Carry sufficient cash for remote locations
- Credit cards are accepted in larger establishments
- Keep small denominations handy for small purchases and tips

## Connectivity

- Mobile network is available in most areas of the Kashmir Valley and Jammu
- Ladakh has limited connectivity, with BSNL having the widest coverage
- Consider purchasing a local SIM card upon arrival
- Download offline maps for navigation in remote areas

## Safety Tips

- Register with your country''s embassy if you''re a foreign national
- Keep emergency contact numbers handy
- Follow local news and advisories
- Avoid isolated areas after dark
- Respect nature and wildlife

## Must-Have Experiences

- **In Kashmir**: Shikara ride on Dal Lake, stay in a houseboat, visit Mughal Gardens
- **In Ladakh**: Visit monasteries, experience Pangong Lake, drive through high mountain passes
- **In Jammu**: Pilgrimage to Vaishno Devi, visit Bahu Fort and Raghunath Temple
- **In Gurez**: Experience traditional village life, trek to viewpoints, interact with the Dard-Shin community

By planning ahead and being prepared for the unique conditions of each region within Jammu & Kashmir, you''ll ensure a memorable and smooth journey through one of India''s most beautiful states.',
    'https://images.pexels.com/photos/4254554/pexels-photo-4254554.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'Raj Gupta',
    '2025-04-28',
    'Travel Guide',
    ARRAY['Travel Tips', 'Jammu', 'Kashmir', 'Planning'],
    'Published',
    278
  );