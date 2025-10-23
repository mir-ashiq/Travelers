import { createClient } from '@supabase/supabase-js';

// Make sure we have valid URL values before creating the client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate URL format before creating client
let supabase: any;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials are missing. Please connect to Supabase from the UI.');
    // Create a dummy client that will be replaced later
    supabase = {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: new Error('No Supabase connection') })
            })
          })
        }),
        insert: () => Promise.resolve({ data: null, error: new Error('No Supabase connection') }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: new Error('No Supabase connection') })
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: new Error('No Supabase connection') })
        }),
      }),
      auth: {
        signIn: () => Promise.resolve({ data: null, error: new Error('No Supabase connection') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('No Supabase connection') }),
        signOut: () => Promise.resolve({ error: null }),
      },
    };
  } else {
    // Validate URL format by attempting to construct a URL object
    new URL(supabaseUrl);
    // If URL is valid, create the client
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error('Invalid Supabase URL:', error);
  // Create a dummy client that will be replaced later
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: new Error('Invalid Supabase URL') })
          })
        })
      }),
      insert: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase URL') }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase URL') })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase URL') })
      }),
    }),
    auth: {
      signIn: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase URL') }),
      signUp: () => Promise.resolve({ data: null, error: new Error('Invalid Supabase URL') }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
}

export { supabase };

// Type definitions for database tables
export type FAQ = {
  id: number;
  question: string;
  answer: string;
  category: string;
  published: boolean;
  created_at?: string;
};

export type SupportTicket = {
  id: number;
  subject: string;
  customer: string;
  email: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  created_at: string;
  assigned_to?: string;
  last_update: string;
};

export type TicketMessage = {
  id: number;
  ticket_id: number;
  from_type: 'customer' | 'agent';
  name: string;
  message: string;
  created_at: string;
};

export type Destination = {
  id: number;
  name: string;
  region: string;
  description: string;
  image: string;
  featured: boolean;
  created_at?: string;
};

export type TourPackage = {
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
  created_at?: string;
};

export type Itinerary = {
  id: number;
  package_id: number;
  day: number;
  title: string;
  description: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  location: string;
  image: string;
  created_at?: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Manager' | 'Guide' | 'Support';
  avatar?: string;
  status: 'Active' | 'Inactive';
  last_login?: string;
  created_at?: string;
};

export type Booking = {
  id: number;
  name: string;
  email: string;
  phone: string;
  package: string;
  travel_date: string;
  booking_date: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  message?: string;
  payment_status: 'Paid' | 'Pending' | 'Refunded';
  source: string;
  assigned_to?: string;
  created_at?: string;
};

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  status: 'Published' | 'Draft';
  views: number;
  created_at?: string;
};

export type Testimonial = {
  id: number;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  message: string;
  status: 'published' | 'pending' | 'rejected';
  date: string;
  created_at?: string;
};