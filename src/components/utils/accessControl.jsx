/**
 * Role-based Access Control Utility
 * Based on HarbourBee access matrix
 */

// Role definitions
export const ROLES = {
  USER: 'user',
  OPS_STAFF: 'ops_staff',
  OPS_ADMIN: 'ops_admin',
  VENDOR_STAFF: 'vendor_staff',
  VENDOR_ADMIN: 'vendor_admin',
  FINANCE: 'finance',
  SUPER_ADMIN: 'super_admin'
};

// Page access matrix
export const PAGE_ACCESS = {
  Dashboard: {
    allowed: [ROLES.USER, ROLES.OPS_STAFF, ROLES.OPS_ADMIN, ROLES.VENDOR_ADMIN, ROLES.FINANCE, ROLES.SUPER_ADMIN],
    readOnly: []
  },
  Orders: {
    allowed: [ROLES.USER, ROLES.OPS_STAFF, ROLES.OPS_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: [ROLES.FINANCE]
  },
  Pools: {
    allowed: [ROLES.USER, ROLES.OPS_STAFF, ROLES.OPS_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: [ROLES.FINANCE]
  },
  Deliveries: {
    allowed: [ROLES.USER, ROLES.OPS_STAFF, ROLES.OPS_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: [ROLES.FINANCE]
  },
  VendorOrders: {
    allowed: [ROLES.OPS_STAFF, ROLES.OPS_ADMIN, ROLES.VENDOR_STAFF, ROLES.VENDOR_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: []
  },
  Products: {
    allowed: [ROLES.USER, ROLES.OPS_ADMIN, ROLES.VENDOR_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: [ROLES.FINANCE]
  },
  AdminCategories: {
    allowed: [ROLES.OPS_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: []
  },
  Vendors: {
    allowed: [ROLES.OPS_ADMIN, ROLES.VENDOR_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: [ROLES.FINANCE]
  },
  UsersVessels: {
    allowed: [ROLES.OPS_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: []
  },
  Finance: {
    allowed: [ROLES.FINANCE, ROLES.SUPER_ADMIN],
    readOnly: []
  },
  Reports: {
    allowed: [ROLES.OPS_ADMIN, ROLES.VENDOR_ADMIN, ROLES.FINANCE, ROLES.SUPER_ADMIN],
    readOnly: []
  },
  Notifications: {
    allowed: [ROLES.USER, ROLES.OPS_STAFF, ROLES.OPS_ADMIN, ROLES.VENDOR_STAFF, ROLES.VENDOR_ADMIN, ROLES.FINANCE, ROLES.SUPER_ADMIN],
    readOnly: []
  },
  Exceptions: {
    allowed: [ROLES.OPS_STAFF, ROLES.OPS_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: []
  },
  SystemHealth: {
    allowed: [ROLES.SUPER_ADMIN],
    readOnly: []
  },
  Settings: {
    allowed: [ROLES.OPS_ADMIN, ROLES.VENDOR_ADMIN, ROLES.SUPER_ADMIN],
    readOnly: []
  }
};

/**
 * Check if a user has access to a page
 */
export function hasPageAccess(userRole, pageName) {
  // Temporarily disabled - all users have access to all pages
  return true;
  
  // Original implementation (commented out):
  // if (!userRole || !pageName) return false;
  // const pageAccess = PAGE_ACCESS[pageName];
  // if (!pageAccess) return false;
  // return pageAccess.allowed.includes(userRole) || pageAccess.readOnly.includes(userRole);
}

/**
 * Check if a user has read-only access to a page
 */
export function isReadOnlyAccess(userRole, pageName) {
  // Temporarily disabled - no read-only restrictions
  return false;
}

/**
 * Get all accessible pages for a role
 */
export function getAccessiblePages(userRole) {
  if (!userRole) return [];
  
  return Object.keys(PAGE_ACCESS).filter(pageName => 
    hasPageAccess(userRole, pageName)
  );
}

/**
 * Check if user can perform write operations
 */
export function canWrite(userRole, pageName) {
  // Temporarily disabled - all users can write
  return true;
}