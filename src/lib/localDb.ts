import { db } from '../db/dexie';

// Export the db to replicate the supabase usage pattern
export { db };

// Mocking the supabase interface for easy replacement
export const localDb = {
  from: (table: string) => {
    const tables: Record<string, any> = {
      'faqs': db.faqs,
      'support_tickets': db.support_tickets,
      'ticket_messages': db.ticket_messages,
      'destinations': db.destinations,
      'packages': db.packages,
      'itineraries': db.itineraries,
      'gallery': db.gallery,
      'admin_users': db.admin_users,
      'bookings': db.bookings,
      'blog_posts': db.blog_posts,
      'testimonials': db.testimonials
    };

    const tableObj = tables[table];
    
    if (!tableObj) {
      throw new Error(`Table "${table}" not found`);
    }

    return {
      select: (columns: string = '*') => {
        // In Dexie we don't need to specify columns, it always returns the full object
        return {
          eq: (column: string, value: any) => {
            return {
              single: async () => {
                try {
                  const result = await tableObj.where(column).equals(value).first();
                  return { data: result, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              },
              maybeSingle: async () => {
                try {
                  const result = await tableObj.where(column).equals(value).first();
                  return { data: result, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              },
              execute: async () => {
                try {
                  const result = await tableObj.where(column).equals(value).toArray();
                  return { data: result, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              }
            };
          },
          neq: (column: string, value: any) => {
            return {
              execute: async () => {
                try {
                  const all = await tableObj.toArray();
                  const filtered = all.filter(item => item[column] !== value);
                  return { data: filtered, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              }
            };
          },
          order: (column: string, { ascending = true } = {}) => {
            return {
              limit: (limit: number) => {
                return {
                  execute: async () => {
                    try {
                      let result = await tableObj.toArray();
                      // Sort the results
                      result.sort((a, b) => {
                        if (ascending) {
                          return a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
                        } else {
                          return a[column] > b[column] ? -1 : a[column] < b[column] ? 1 : 0;
                        }
                      });
                      // Apply limit
                      if (limit) {
                        result = result.slice(0, limit);
                      }
                      return { data: result, error: null };
                    } catch (error) {
                      return { data: null, error };
                    }
                  }
                };
              },
              execute: async () => {
                try {
                  let result = await tableObj.toArray();
                  // Sort the results
                  result.sort((a, b) => {
                    if (ascending) {
                      return a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
                    } else {
                      return a[column] > b[column] ? -1 : a[column] < b[column] ? 1 : 0;
                    }
                  });
                  return { data: result, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              }
            };
          },
          in: (column: string, values: any[]) => {
            return {
              execute: async () => {
                try {
                  const all = await tableObj.toArray();
                  const filtered = all.filter(item => values.includes(item[column]));
                  return { data: filtered, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              }
            };
          },
          limit: (limit: number) => {
            return {
              execute: async () => {
                try {
                  const result = await tableObj.limit(limit).toArray();
                  return { data: result, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              }
            };
          },
          execute: async () => {
            try {
              const result = await tableObj.toArray();
              return { data: result, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        };
      },
      insert: (records: any[]) => {
        return {
          select: async () => {
            try {
              const insertedIds = await tableObj.bulkAdd(records, { allKeys: true });
              const insertedRecords = await Promise.all(
                insertedIds.map(id => tableObj.get(id))
              );
              return { data: insertedRecords, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        };
      },
      update: (updateData: any) => {
        return {
          eq: (column: string, value: any) => {
            return {
              select: async () => {
                try {
                  await tableObj.where(column).equals(value).modify(updateData);
                  const updatedRecords = await tableObj.where(column).equals(value).toArray();
                  return { data: updatedRecords, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              }
            };
          },
          in: (column: string, values: any[]) => {
            return {
              execute: async () => {
                try {
                  // Get the records that match the 'in' condition
                  const recordsToUpdate = await tableObj.where(column).anyOf(values).toArray();
                  
                  // Update each record
                  await Promise.all(
                    recordsToUpdate.map(record => 
                      tableObj.update(record.id!, updateData)
                    )
                  );
                  
                  return { data: null, error: null };
                } catch (error) {
                  return { data: null, error };
                }
              }
            };
          }
        };
      },
      delete: () => {
        return {
          eq: async (column: string, value: any) => {
            try {
              await tableObj.where(column).equals(value).delete();
              return { error: null };
            } catch (error) {
              return { error };
            }
          },
          in: async (column: string, values: any[]) => {
            try {
              await tableObj.where(column).anyOf(values).delete();
              return { error: null };
            } catch (error) {
              return { error };
            }
          }
        };
      }
    };
  },
  
  // Mock auth methods
  auth: {
    signIn: async (credentials: any) => {
      try {
        // In a real implementation, you would check credentials against stored users
        // For demo purposes, hardcode admin@jklgtravel.com/admin123
        if (credentials.email === 'admin@jklgtravel.com' && credentials.password === 'admin123') {
          const user = await db.admin_users.where('email').equals(credentials.email).first();
          
          if (user) {
            // Update last login
            await db.admin_users.update(user.id!, { last_login: new Date().toISOString() });
            return { data: { user }, error: null };
          }
        }
        return { data: null, error: new Error('Invalid credentials') };
      } catch (error) {
        return { data: null, error };
      }
    },
    
    signOut: async () => {
      // In a client-side app, you would clear stored tokens/session
      return { error: null };
    },
    
    // Helper for current role check (used in RLS policies)
    role: () => {
      // In a real app, this would check the current user's role
      // For this mock, we'll assume the user is always authenticated
      return 'authenticated';
    }
  }
};