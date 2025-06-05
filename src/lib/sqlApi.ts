import { getDb } from './sqlDb';
import { 
  FAQ, 
  SupportTicket, 
  TicketMessage, 
  Destination, 
  TourPackage, 
  Itinerary, 
  GalleryItem,
  AdminUser,
  Booking,
  BlogPost,
  Testimonial
} from './types';

// Helper function to get the database instance
function db() {
  const database = getDb();
  if (!database) {
    throw new Error('Database not initialized');
  }
  return database;
}

// Convert row to object with proper types
function rowToObject(columns, row) {
  const obj = {};
  columns.forEach((col, index) => {
    let value = row[index];
    
    // Handle arrays stored as JSON
    if (col === 'destinations' || col === 'included' || col === 'excluded' || col === 'tags') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error(`Failed to parse JSON for column ${col}:`, e);
        value = [];
      }
    }
    
    // Handle booleans
    if (col === 'featured' || col === 'published') {
      value = Boolean(value);
    }
    
    obj[col] = value;
  });
  return obj;
}

// Execute a SELECT query and map results
function executeSelect(query, params = []) {
  try {
    const stmt = db().prepare(query);
    stmt.bind(params);
    
    const results = [];
    while (stmt.step()) {
      const row = stmt.get();
      const columns = stmt.getColumnNames();
      results.push(rowToObject(columns, row));
    }
    
    stmt.free();
    return { data: results, error: null };
  } catch (error) {
    console.error(`Error executing query: ${query}`, error);
    return { data: null, error };
  }
}

// Execute a non-SELECT query (INSERT, UPDATE, DELETE)
function executeNonQuery(query, params = []) {
  try {
    const stmt = db().prepare(query);
    stmt.bind(params);
    stmt.step();
    stmt.free();
    
    return { error: null };
  } catch (error) {
    console.error(`Error executing query: ${query}`, error);
    return { error };
  }
}

// Get last inserted id
function getLastInsertId() {
  try {
    const result = db().exec("SELECT last_insert_rowid()");
    if (result && result[0] && result[0].values && result[0].values[0]) {
      return result[0].values[0][0];
    }
    return null;
  } catch (error) {
    console.error('Error getting last insert ID:', error);
    return null;
  }
}

// FAQs API
export const faqsApi = {
  getAll: async () => {
    const result = executeSelect("SELECT * FROM faqs");
    return result.data || [];
  },
  
  getByCategory: async (category: string) => {
    const result = executeSelect("SELECT * FROM faqs WHERE category = ?", [category]);
    return result.data || [];
  },
  
  getPublished: async () => {
    const result = executeSelect("SELECT * FROM faqs WHERE published = 1");
    return result.data || [];
  },
  
  getById: async (id: number) => {
    const result = executeSelect("SELECT * FROM faqs WHERE id = ?", [id]);
    return result.data?.[0] || null;
  },
  
  add: async (faq: FAQ) => {
    const query = `INSERT INTO faqs (question, answer, category, published) 
                  VALUES (?, ?, ?, ?)`;
    const result = executeNonQuery(query, [
      faq.question,
      faq.answer,
      faq.category,
      faq.published ? 1 : 0
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, faq: Partial<FAQ>) => {
    const setClauses = [];
    const params = [];
    
    if (faq.question !== undefined) {
      setClauses.push("question = ?");
      params.push(faq.question);
    }
    
    if (faq.answer !== undefined) {
      setClauses.push("answer = ?");
      params.push(faq.answer);
    }
    
    if (faq.category !== undefined) {
      setClauses.push("category = ?");
      params.push(faq.category);
    }
    
    if (faq.published !== undefined) {
      setClauses.push("published = ?");
      params.push(faq.published ? 1 : 0);
    }
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE faqs SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    const result = executeNonQuery("DELETE FROM faqs WHERE id = ?", [id]);
    return result.error === null;
  },
  
  togglePublished: async (id: number) => {
    const query = `UPDATE faqs SET published = NOT published WHERE id = ?`;
    const result = executeNonQuery(query, [id]);
    return result.error === null;
  }
};

// Destinations API
export const destinationsApi = {
  getAll: async () => {
    const result = executeSelect("SELECT * FROM destinations");
    return result.data || [];
  },
  
  getFeatured: async () => {
    const result = executeSelect("SELECT * FROM destinations WHERE featured = 1");
    return result.data || [];
  },
  
  getByRegion: async (region: string) => {
    const result = executeSelect("SELECT * FROM destinations WHERE region = ?", [region]);
    return result.data || [];
  },
  
  getById: async (id: number) => {
    const result = executeSelect("SELECT * FROM destinations WHERE id = ?", [id]);
    return result.data?.[0] || null;
  },
  
  add: async (destination: Destination) => {
    const query = `INSERT INTO destinations (name, region, description, image, featured) 
                  VALUES (?, ?, ?, ?, ?)`;
    const result = executeNonQuery(query, [
      destination.name,
      destination.region,
      destination.description,
      destination.image,
      destination.featured ? 1 : 0
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, destination: Partial<Destination>) => {
    const setClauses = [];
    const params = [];
    
    if (destination.name !== undefined) {
      setClauses.push("name = ?");
      params.push(destination.name);
    }
    
    if (destination.region !== undefined) {
      setClauses.push("region = ?");
      params.push(destination.region);
    }
    
    if (destination.description !== undefined) {
      setClauses.push("description = ?");
      params.push(destination.description);
    }
    
    if (destination.image !== undefined) {
      setClauses.push("image = ?");
      params.push(destination.image);
    }
    
    if (destination.featured !== undefined) {
      setClauses.push("featured = ?");
      params.push(destination.featured ? 1 : 0);
    }
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE destinations SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    const result = executeNonQuery("DELETE FROM destinations WHERE id = ?", [id]);
    return result.error === null;
  },
  
  toggleFeatured: async (id: number) => {
    const query = `UPDATE destinations SET featured = NOT featured WHERE id = ?`;
    const result = executeNonQuery(query, [id]);
    return result.error === null;
  }
};

// Packages API
export const packagesApi = {
  getAll: async () => {
    const result = executeSelect("SELECT * FROM packages");
    return result.data || [];
  },
  
  getFeatured: async () => {
    const result = executeSelect("SELECT * FROM packages WHERE featured = 1");
    return result.data || [];
  },
  
  getById: async (id: number) => {
    const result = executeSelect("SELECT * FROM packages WHERE id = ?", [id]);
    return result.data?.[0] || null;
  },
  
  add: async (pkg: TourPackage) => {
    const query = `INSERT INTO packages (
      title, description, price, duration, image, destinations,
      featured, rating, accommodations, included, excluded
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const result = executeNonQuery(query, [
      pkg.title,
      pkg.description,
      pkg.price,
      pkg.duration,
      pkg.image,
      JSON.stringify(pkg.destinations),
      pkg.featured ? 1 : 0,
      pkg.rating,
      pkg.accommodations,
      JSON.stringify(pkg.included),
      JSON.stringify(pkg.excluded)
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, pkg: Partial<TourPackage>) => {
    const setClauses = [];
    const params = [];
    
    if (pkg.title !== undefined) {
      setClauses.push("title = ?");
      params.push(pkg.title);
    }
    
    if (pkg.description !== undefined) {
      setClauses.push("description = ?");
      params.push(pkg.description);
    }
    
    if (pkg.price !== undefined) {
      setClauses.push("price = ?");
      params.push(pkg.price);
    }
    
    if (pkg.duration !== undefined) {
      setClauses.push("duration = ?");
      params.push(pkg.duration);
    }
    
    if (pkg.image !== undefined) {
      setClauses.push("image = ?");
      params.push(pkg.image);
    }
    
    if (pkg.destinations !== undefined) {
      setClauses.push("destinations = ?");
      params.push(JSON.stringify(pkg.destinations));
    }
    
    if (pkg.featured !== undefined) {
      setClauses.push("featured = ?");
      params.push(pkg.featured ? 1 : 0);
    }
    
    if (pkg.rating !== undefined) {
      setClauses.push("rating = ?");
      params.push(pkg.rating);
    }
    
    if (pkg.accommodations !== undefined) {
      setClauses.push("accommodations = ?");
      params.push(pkg.accommodations);
    }
    
    if (pkg.included !== undefined) {
      setClauses.push("included = ?");
      params.push(JSON.stringify(pkg.included));
    }
    
    if (pkg.excluded !== undefined) {
      setClauses.push("excluded = ?");
      params.push(JSON.stringify(pkg.excluded));
    }
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE packages SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    // Begin transaction to delete package and its itineraries
    try {
      db().exec('BEGIN TRANSACTION');
      
      // First, delete related itineraries
      executeNonQuery("DELETE FROM itineraries WHERE package_id = ?", [id]);
      
      // Then delete the package
      executeNonQuery("DELETE FROM packages WHERE id = ?", [id]);
      
      db().exec('COMMIT');
      return true;
    } catch (error) {
      db().exec('ROLLBACK');
      console.error('Error removing package:', error);
      return false;
    }
  },
  
  toggleFeatured: async (id: number) => {
    const query = `UPDATE packages SET featured = NOT featured WHERE id = ?`;
    const result = executeNonQuery(query, [id]);
    return result.error === null;
  }
};

// Itineraries API
export const itinerariesApi = {
  getByPackageId: async (packageId: number) => {
    const result = executeSelect(
      "SELECT * FROM itineraries WHERE package_id = ? ORDER BY day",
      [packageId]
    );
    return result.data || [];
  },
  
  add: async (itinerary: Itinerary) => {
    const query = `INSERT INTO itineraries (package_id, day, title, description) 
                  VALUES (?, ?, ?, ?)`;
    const result = executeNonQuery(query, [
      itinerary.package_id,
      itinerary.day,
      itinerary.title,
      itinerary.description
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, itinerary: Partial<Itinerary>) => {
    const setClauses = [];
    const params = [];
    
    if (itinerary.package_id !== undefined) {
      setClauses.push("package_id = ?");
      params.push(itinerary.package_id);
    }
    
    if (itinerary.day !== undefined) {
      setClauses.push("day = ?");
      params.push(itinerary.day);
    }
    
    if (itinerary.title !== undefined) {
      setClauses.push("title = ?");
      params.push(itinerary.title);
    }
    
    if (itinerary.description !== undefined) {
      setClauses.push("description = ?");
      params.push(itinerary.description);
    }
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE itineraries SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    const result = executeNonQuery("DELETE FROM itineraries WHERE id = ?", [id]);
    return result.error === null;
  }
};

// Gallery API
export const galleryApi = {
  getAll: async () => {
    const result = executeSelect("SELECT * FROM gallery");
    return result.data || [];
  },
  
  getByLocation: async (location: string) => {
    const result = executeSelect("SELECT * FROM gallery WHERE location = ?", [location]);
    return result.data || [];
  },
  
  getById: async (id: number) => {
    const result = executeSelect("SELECT * FROM gallery WHERE id = ?", [id]);
    return result.data?.[0] || null;
  },
  
  add: async (item: GalleryItem) => {
    const query = `INSERT INTO gallery (title, location, image) 
                  VALUES (?, ?, ?)`;
    const result = executeNonQuery(query, [
      item.title,
      item.location,
      item.image
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, item: Partial<GalleryItem>) => {
    const setClauses = [];
    const params = [];
    
    if (item.title !== undefined) {
      setClauses.push("title = ?");
      params.push(item.title);
    }
    
    if (item.location !== undefined) {
      setClauses.push("location = ?");
      params.push(item.location);
    }
    
    if (item.image !== undefined) {
      setClauses.push("image = ?");
      params.push(item.image);
    }
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE gallery SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    const result = executeNonQuery("DELETE FROM gallery WHERE id = ?", [id]);
    return result.error === null;
  }
};

// Support Tickets API
export const supportTicketsApi = {
  getAll: async () => {
    const result = executeSelect("SELECT * FROM support_tickets");
    return result.data || [];
  },
  
  getById: async (id: number) => {
    const result = executeSelect("SELECT * FROM support_tickets WHERE id = ?", [id]);
    return result.data?.[0] || null;
  },
  
  getByStatus: async (status: string) => {
    const result = executeSelect("SELECT * FROM support_tickets WHERE status = ?", [status]);
    return result.data || [];
  },
  
  add: async (ticket: SupportTicket) => {
    const query = `INSERT INTO support_tickets (
      subject, customer, email, status, priority, category, assigned_to, last_update
    ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
    
    const result = executeNonQuery(query, [
      ticket.subject,
      ticket.customer,
      ticket.email,
      ticket.status,
      ticket.priority,
      ticket.category,
      ticket.assigned_to || null
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, ticket: Partial<SupportTicket>) => {
    const setClauses = [];
    const params = [];
    
    if (ticket.subject !== undefined) {
      setClauses.push("subject = ?");
      params.push(ticket.subject);
    }
    
    if (ticket.customer !== undefined) {
      setClauses.push("customer = ?");
      params.push(ticket.customer);
    }
    
    if (ticket.email !== undefined) {
      setClauses.push("email = ?");
      params.push(ticket.email);
    }
    
    if (ticket.status !== undefined) {
      setClauses.push("status = ?");
      params.push(ticket.status);
    }
    
    if (ticket.priority !== undefined) {
      setClauses.push("priority = ?");
      params.push(ticket.priority);
    }
    
    if (ticket.category !== undefined) {
      setClauses.push("category = ?");
      params.push(ticket.category);
    }
    
    if (ticket.assigned_to !== undefined) {
      setClauses.push("assigned_to = ?");
      params.push(ticket.assigned_to);
    }
    
    // Always update last_update timestamp
    setClauses.push("last_update = CURRENT_TIMESTAMP");
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE support_tickets SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    try {
      db().exec('BEGIN TRANSACTION');
      
      // First, delete related messages
      executeNonQuery("DELETE FROM ticket_messages WHERE ticket_id = ?", [id]);
      
      // Then delete the ticket
      executeNonQuery("DELETE FROM support_tickets WHERE id = ?", [id]);
      
      db().exec('COMMIT');
      return true;
    } catch (error) {
      db().exec('ROLLBACK');
      console.error('Error removing ticket:', error);
      return false;
    }
  }
};

// Ticket Messages API
export const ticketMessagesApi = {
  getByTicketId: async (ticketId: number) => {
    const result = executeSelect(
      "SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at",
      [ticketId]
    );
    return result.data || [];
  },
  
  add: async (message: TicketMessage) => {
    // Begin transaction to add message and update ticket last_update
    try {
      db().exec('BEGIN TRANSACTION');
      
      // Insert message
      const query = `INSERT INTO ticket_messages (ticket_id, from_type, name, message) 
                     VALUES (?, ?, ?, ?)`;
      
      const result = executeNonQuery(query, [
        message.ticket_id,
        message.from_type,
        message.name,
        message.message
      ]);
      
      if (result.error) throw result.error;
      
      // Update ticket last_update
      const updateQuery = `UPDATE support_tickets 
                          SET last_update = CURRENT_TIMESTAMP 
                          WHERE id = ?`;
      
      const updateResult = executeNonQuery(updateQuery, [message.ticket_id]);
      
      if (updateResult.error) throw updateResult.error;
      
      db().exec('COMMIT');
      return getLastInsertId();
    } catch (error) {
      db().exec('ROLLBACK');
      console.error('Error adding ticket message:', error);
      return null;
    }
  }
};

// Admin Users API
export const adminUsersApi = {
  getAll: async () => {
    const result = executeSelect("SELECT * FROM admin_users");
    return result.data || [];
  },
  
  getById: async (id: number) => {
    const result = executeSelect("SELECT * FROM admin_users WHERE id = ?", [id]);
    return result.data?.[0] || null;
  },
  
  getByEmail: async (email: string) => {
    const result = executeSelect("SELECT * FROM admin_users WHERE email = ?", [email]);
    return result.data?.[0] || null;
  },
  
  add: async (user: AdminUser & { password: string }) => {
    const query = `INSERT INTO admin_users (
      name, email, phone, role, avatar, status, password
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const result = executeNonQuery(query, [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.avatar || null,
      user.status,
      user.password // In a real app, this would be a hashed password
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, user: Partial<AdminUser> & { password?: string }) => {
    const setClauses = [];
    const params = [];
    
    if (user.name !== undefined) {
      setClauses.push("name = ?");
      params.push(user.name);
    }
    
    if (user.email !== undefined) {
      setClauses.push("email = ?");
      params.push(user.email);
    }
    
    if (user.phone !== undefined) {
      setClauses.push("phone = ?");
      params.push(user.phone);
    }
    
    if (user.role !== undefined) {
      setClauses.push("role = ?");
      params.push(user.role);
    }
    
    if (user.avatar !== undefined) {
      setClauses.push("avatar = ?");
      params.push(user.avatar);
    }
    
    if (user.status !== undefined) {
      setClauses.push("status = ?");
      params.push(user.status);
    }
    
    if (user.password !== undefined) {
      setClauses.push("password = ?");
      params.push(user.password); // In a real app, this would be a hashed password
    }
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE admin_users SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    const result = executeNonQuery("DELETE FROM admin_users WHERE id = ?", [id]);
    return result.error === null;
  },
  
  toggleStatus: async (id: number) => {
    const query = `
      UPDATE admin_users 
      SET status = CASE 
        WHEN status = 'Active' THEN 'Inactive' 
        ELSE 'Active' 
      END 
      WHERE id = ?
    `;
    
    const result = executeNonQuery(query, [id]);
    return result.error === null;
  },
  
  updateLastLogin: async (id: number) => {
    const query = `UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?`;
    const result = executeNonQuery(query, [id]);
    return result.error === null;
  },
  
  login: async (email: string, password: string) => {
    // In a real app, you would hash the password and compare with the stored hash
    const result = executeSelect(
      "SELECT * FROM admin_users WHERE email = ? AND password = ? AND status = 'Active'",
      [email, password]
    );
    
    if (result.data && result.data.length > 0) {
      const user = result.data[0];
      
      // Update last login time
      executeNonQuery(
        "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
        [user.id]
      );
      
      return { user, error: null };
    }
    
    return { user: null, error: new Error('Invalid credentials') };
  }
};

// Bookings API
export const bookingsApi = {
  getAll: async () => {
    const result = executeSelect("SELECT * FROM bookings");
    return result.data || [];
  },
  
  getById: async (id: number) => {
    const result = executeSelect("SELECT * FROM bookings WHERE id = ?", [id]);
    return result.data?.[0] || null;
  },
  
  getByStatus: async (status: string) => {
    const result = executeSelect("SELECT * FROM bookings WHERE status = ?", [status]);
    return result.data || [];
  },
  
  add: async (booking: Booking) => {
    const query = `INSERT INTO bookings (
      name, email, phone, package, travel_date, booking_date,
      amount, status, message, payment_status, source, assigned_to
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const result = executeNonQuery(query, [
      booking.name,
      booking.email,
      booking.phone,
      booking.package,
      booking.travel_date,
      booking.booking_date,
      booking.amount,
      booking.status,
      booking.message || null,
      booking.payment_status,
      booking.source,
      booking.assigned_to || null
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, booking: Partial<Booking>) => {
    const setClauses = [];
    const params = [];
    
    if (booking.name !== undefined) {
      setClauses.push("name = ?");
      params.push(booking.name);
    }
    
    if (booking.email !== undefined) {
      setClauses.push("email = ?");
      params.push(booking.email);
    }
    
    if (booking.phone !== undefined) {
      setClauses.push("phone = ?");
      params.push(booking.phone);
    }
    
    if (booking.package !== undefined) {
      setClauses.push("package = ?");
      params.push(booking.package);
    }
    
    if (booking.travel_date !== undefined) {
      setClauses.push("travel_date = ?");
      params.push(booking.travel_date);
    }
    
    if (booking.booking_date !== undefined) {
      setClauses.push("booking_date = ?");
      params.push(booking.booking_date);
    }
    
    if (booking.amount !== undefined) {
      setClauses.push("amount = ?");
      params.push(booking.amount);
    }
    
    if (booking.status !== undefined) {
      setClauses.push("status = ?");
      params.push(booking.status);
    }
    
    if (booking.message !== undefined) {
      setClauses.push("message = ?");
      params.push(booking.message);
    }
    
    if (booking.payment_status !== undefined) {
      setClauses.push("payment_status = ?");
      params.push(booking.payment_status);
    }
    
    if (booking.source !== undefined) {
      setClauses.push("source = ?");
      params.push(booking.source);
    }
    
    if (booking.assigned_to !== undefined) {
      setClauses.push("assigned_to = ?");
      params.push(booking.assigned_to);
    }
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE bookings SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    const result = executeNonQuery("DELETE FROM bookings WHERE id = ?", [id]);
    return result.error === null;
  },
  
  updateStatus: async (id: number, status: string) => {
    const query = `UPDATE bookings SET status = ? WHERE id = ?`;
    const result = executeNonQuery(query, [status, id]);
    return result.error === null;
  }
};

// Blog Posts API
export const blogPostsApi = {
  getAll: async () => {
    const result = executeSelect("SELECT * FROM blog_posts");
    return result.data || [];
  },
  
  getPublished: async () => {
    const result = executeSelect("SELECT * FROM blog_posts WHERE status = 'Published'");
    return result.data || [];
  },
  
  getById: async (id: number) => {
    const result = executeSelect("SELECT * FROM blog_posts WHERE id = ?", [id]);
    return result.data?.[0] || null;
  },
  
  getByCategory: async (category: string) => {
    const result = executeSelect("SELECT * FROM blog_posts WHERE category = ?", [category]);
    return result.data || [];
  },
  
  add: async (post: BlogPost) => {
    const query = `INSERT INTO blog_posts (
      title, excerpt, content, featured_image, author,
      date, category, tags, status, views
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const result = executeNonQuery(query, [
      post.title,
      post.excerpt,
      post.content,
      post.featured_image,
      post.author,
      post.date,
      post.category,
      JSON.stringify(post.tags),
      post.status,
      post.views || 0
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, post: Partial<BlogPost>) => {
    const setClauses = [];
    const params = [];
    
    if (post.title !== undefined) {
      setClauses.push("title = ?");
      params.push(post.title);
    }
    
    if (post.excerpt !== undefined) {
      setClauses.push("excerpt = ?");
      params.push(post.excerpt);
    }
    
    if (post.content !== undefined) {
      setClauses.push("content = ?");
      params.push(post.content);
    }
    
    if (post.featured_image !== undefined) {
      setClauses.push("featured_image = ?");
      params.push(post.featured_image);
    }
    
    if (post.author !== undefined) {
      setClauses.push("author = ?");
      params.push(post.author);
    }
    
    if (post.date !== undefined) {
      setClauses.push("date = ?");
      params.push(post.date);
    }
    
    if (post.category !== undefined) {
      setClauses.push("category = ?");
      params.push(post.category);
    }
    
    if (post.tags !== undefined) {
      setClauses.push("tags = ?");
      params.push(JSON.stringify(post.tags));
    }
    
    if (post.status !== undefined) {
      setClauses.push("status = ?");
      params.push(post.status);
    }
    
    if (post.views !== undefined) {
      setClauses.push("views = ?");
      params.push(post.views);
    }
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE blog_posts SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    const result = executeNonQuery("DELETE FROM blog_posts WHERE id = ?", [id]);
    return result.error === null;
  },
  
  togglePublished: async (id: number) => {
    const query = `
      UPDATE blog_posts 
      SET status = CASE 
        WHEN status = 'Published' THEN 'Draft' 
        ELSE 'Published' 
      END 
      WHERE id = ?
    `;
    
    const result = executeNonQuery(query, [id]);
    return result.error === null;
  },
  
  incrementViews: async (id: number) => {
    const query = `UPDATE blog_posts SET views = views + 1 WHERE id = ?`;
    const result = executeNonQuery(query, [id]);
    return result.error === null;
  }
};

// Testimonials API
export const testimonialsApi = {
  getAll: async () => {
    const result = executeSelect("SELECT * FROM testimonials");
    return result.data || [];
  },
  
  getPublished: async () => {
    const result = executeSelect("SELECT * FROM testimonials WHERE status = 'published'");
    return result.data || [];
  },
  
  getPending: async () => {
    const result = executeSelect("SELECT * FROM testimonials WHERE status = 'pending'");
    return result.data || [];
  },
  
  getById: async (id: number) => {
    const result = executeSelect("SELECT * FROM testimonials WHERE id = ?", [id]);
    return result.data?.[0] || null;
  },
  
  add: async (testimonial: Testimonial) => {
    const query = `INSERT INTO testimonials (
      name, avatar, location, rating, message, status, date
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    const result = executeNonQuery(query, [
      testimonial.name,
      testimonial.avatar,
      testimonial.location,
      testimonial.rating,
      testimonial.message,
      testimonial.status,
      testimonial.date
    ]);
    
    if (!result.error) {
      return getLastInsertId();
    }
    
    return null;
  },
  
  update: async (id: number, testimonial: Partial<Testimonial>) => {
    const setClauses = [];
    const params = [];
    
    if (testimonial.name !== undefined) {
      setClauses.push("name = ?");
      params.push(testimonial.name);
    }
    
    if (testimonial.avatar !== undefined) {
      setClauses.push("avatar = ?");
      params.push(testimonial.avatar);
    }
    
    if (testimonial.location !== undefined) {
      setClauses.push("location = ?");
      params.push(testimonial.location);
    }
    
    if (testimonial.rating !== undefined) {
      setClauses.push("rating = ?");
      params.push(testimonial.rating);
    }
    
    if (testimonial.message !== undefined) {
      setClauses.push("message = ?");
      params.push(testimonial.message);
    }
    
    if (testimonial.status !== undefined) {
      setClauses.push("status = ?");
      params.push(testimonial.status);
    }
    
    if (testimonial.date !== undefined) {
      setClauses.push("date = ?");
      params.push(testimonial.date);
    }
    
    if (setClauses.length === 0) {
      return false;
    }
    
    params.push(id);
    
    const query = `UPDATE testimonials SET ${setClauses.join(", ")} WHERE id = ?`;
    const result = executeNonQuery(query, params);
    
    return result.error === null;
  },
  
  remove: async (id: number) => {
    const result = executeNonQuery("DELETE FROM testimonials WHERE id = ?", [id]);
    return result.error === null;
  },
  
  updateStatus: async (id: number, status: 'published' | 'pending' | 'rejected') => {
    const query = `UPDATE testimonials SET status = ? WHERE id = ?`;
    const result = executeNonQuery(query, [status, id]);
    return result.error === null;
  }
};