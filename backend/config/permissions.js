/**
 * Role-Based Access Control (RBAC) Configuration
 * Defines permissions for each role in the system
 */

export const ROLE_PERMISSIONS = {
  Admin: {
    // User Management
    users_view: true,
    users_create: true,
    users_edit: true,
    users_delete: true,
    users_change_role: true,
    
    // Bookings
    bookings_view: true,
    bookings_create: true,
    bookings_edit: true,
    bookings_delete: true,
    bookings_reassign: true,
    bookings_update_payment: true,
    bookings_send_reminder: true,
    bookings_export: true,
    bookings_bulk_actions: true,
    
    // Destinations
    destinations_view: true,
    destinations_create: true,
    destinations_edit: true,
    destinations_delete: true,
    
    // Packages
    packages_view: true,
    packages_create: true,
    packages_edit: true,
    packages_delete: true,
    
    // Gallery
    gallery_view: true,
    gallery_create: true,
    gallery_edit: true,
    gallery_delete: true,
    
    // Blog
    blog_view: true,
    blog_create: true,
    blog_edit: true,
    blog_delete: true,
    
    // Testimonials
    testimonials_view: true,
    testimonials_create: true,
    testimonials_edit: true,
    testimonials_delete: true,
    testimonials_approve: true,
    
    // Support/Tickets
    tickets_view: true,
    tickets_create: true,
    tickets_edit: true,
    tickets_delete: true,
    tickets_assign: true,
    
    // FAQ
    faq_view: true,
    faq_create: true,
    faq_edit: true,
    faq_delete: true,
    
    // Settings & Reports
    settings_view: true,
    settings_edit: true,
    reports_view: true,
    dashboard_view: true,
  },

  Manager: {
    // User Management (Limited)
    users_view: true,
    users_create: false,
    users_edit: false,
    users_delete: false,
    users_change_role: false,
    
    // Bookings (Full)
    bookings_view: true,
    bookings_create: true,
    bookings_edit: true,
    bookings_delete: false,
    bookings_reassign: true,
    bookings_update_payment: true,
    bookings_send_reminder: true,
    bookings_export: true,
    bookings_bulk_actions: true,
    
    // Destinations (Full)
    destinations_view: true,
    destinations_create: true,
    destinations_edit: true,
    destinations_delete: true,
    
    // Packages (Full)
    packages_view: true,
    packages_create: true,
    packages_edit: true,
    packages_delete: true,
    
    // Gallery
    gallery_view: true,
    gallery_create: true,
    gallery_edit: true,
    gallery_delete: true,
    
    // Blog
    blog_view: true,
    blog_create: true,
    blog_edit: true,
    blog_delete: true,
    
    // Testimonials
    testimonials_view: true,
    testimonials_create: false,
    testimonials_edit: false,
    testimonials_delete: false,
    testimonials_approve: true,
    
    // Support/Tickets
    tickets_view: true,
    tickets_create: true,
    tickets_edit: true,
    tickets_delete: false,
    tickets_assign: true,
    
    // FAQ
    faq_view: true,
    faq_create: true,
    faq_edit: true,
    faq_delete: true,
    
    // Settings & Reports
    settings_view: false,
    settings_edit: false,
    reports_view: true,
    dashboard_view: true,
  },

  Guide: {
    // User Management (None)
    users_view: false,
    users_create: false,
    users_edit: false,
    users_delete: false,
    users_change_role: false,
    
    // Bookings (Limited to assigned)
    bookings_view: true,
    bookings_create: false,
    bookings_edit: false,
    bookings_delete: false,
    bookings_reassign: false,
    bookings_update_payment: false,
    bookings_send_reminder: true,
    bookings_export: false,
    bookings_bulk_actions: false,
    
    // Destinations (View only)
    destinations_view: true,
    destinations_create: false,
    destinations_edit: false,
    destinations_delete: false,
    
    // Packages (View only)
    packages_view: true,
    packages_create: false,
    packages_edit: false,
    packages_delete: false,
    
    // Gallery
    gallery_view: true,
    gallery_create: false,
    gallery_edit: false,
    gallery_delete: false,
    
    // Blog
    blog_view: true,
    blog_create: false,
    blog_edit: false,
    blog_delete: false,
    
    // Testimonials
    testimonials_view: true,
    testimonials_create: false,
    testimonials_edit: false,
    testimonials_delete: false,
    testimonials_approve: false,
    
    // Support/Tickets
    tickets_view: false,
    tickets_create: false,
    tickets_edit: false,
    tickets_delete: false,
    tickets_assign: false,
    
    // FAQ
    faq_view: true,
    faq_create: false,
    faq_edit: false,
    faq_delete: false,
    
    // Settings & Reports
    settings_view: false,
    settings_edit: false,
    reports_view: false,
    dashboard_view: true,
  },

  Support: {
    // User Management (None)
    users_view: false,
    users_create: false,
    users_edit: false,
    users_delete: false,
    users_change_role: false,
    
    // Bookings (Limited operations)
    bookings_view: true,
    bookings_create: true,
    bookings_edit: true,
    bookings_delete: false,
    bookings_reassign: false,
    bookings_update_payment: false,
    bookings_send_reminder: true,
    bookings_export: false,
    bookings_bulk_actions: false,
    
    // Destinations
    destinations_view: true,
    destinations_create: false,
    destinations_edit: false,
    destinations_delete: false,
    
    // Packages
    packages_view: true,
    packages_create: false,
    packages_edit: false,
    packages_delete: false,
    
    // Gallery
    gallery_view: true,
    gallery_create: false,
    gallery_edit: false,
    gallery_delete: false,
    
    // Blog
    blog_view: true,
    blog_create: false,
    blog_edit: false,
    blog_delete: false,
    
    // Testimonials
    testimonials_view: true,
    testimonials_create: false,
    testimonials_edit: false,
    testimonials_delete: false,
    testimonials_approve: false,
    
    // Support/Tickets (Full)
    tickets_view: true,
    tickets_create: true,
    tickets_edit: true,
    tickets_delete: false,
    tickets_assign: false,
    
    // FAQ
    faq_view: true,
    faq_create: false,
    faq_edit: false,
    faq_delete: false,
    
    // Settings & Reports
    settings_view: false,
    settings_edit: false,
    reports_view: false,
    dashboard_view: true,
  },
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role (Admin, Manager, Guide, Support)
 * @param {string} permission - Permission key
 * @returns {boolean} - Whether role has permission
 */
export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions[permission] === true;
};

/**
 * Check if a role has any of the given permissions
 * @param {string} role - User role
 * @param {string[]} permissions - Array of permission keys
 * @returns {boolean}
 */
export const hasAnyPermission = (role, permissions) => {
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the given permissions
 * @param {string} role - User role
 * @param {string[]} permissions - Array of permission keys
 * @returns {boolean}
 */
export const hasAllPermissions = (role, permissions) => {
  return permissions.every(permission => hasPermission(role, permission));
};
