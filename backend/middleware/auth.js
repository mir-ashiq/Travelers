/**
 * Authorization Middleware
 * Implements role-based access control (RBAC)
 */

import jwt from 'jsonwebtoken';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../config/permissions.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware: Verify JWT token and extract user info
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Middleware: Verify user is authenticated and is an admin
 * Only allows Admin role
 */
export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== 'Admin') {
      return res.status(403).json({ error: 'Only admins can perform this action' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Middleware factory: Verify user has required permission
 * @param {string|string[]} requiredPermissions - Single permission or array of permissions
 * @param {boolean} requireAll - If true, user must have ALL permissions; if false, ANY permission
 * @returns {Function} Express middleware
 */
export const requirePermission = (requiredPermissions, requireAll = false) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      // Normalize permissions to array
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      // Check permissions
      const hasAccess = requireAll
        ? hasAllPermissions(decoded.role, permissions)
        : hasAnyPermission(decoded.role, permissions);

      if (!hasAccess) {
        const permissionList = permissions.join(', ');
        return res.status(403).json({ 
          error: `Insufficient permissions. Required: ${permissionList}` 
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

/**
 * Middleware factory: Verify multiple permission sets (OR logic)
 * User needs to have ALL permissions in at least ONE set
 * @param {string[][]} permissionSets - Array of permission arrays
 * @returns {Function} Express middleware
 */
export const requireAnyPermissionSet = (permissionSets) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      // Check if user has all permissions in at least one set
      const hasAccess = permissionSets.some(permissions => 
        hasAllPermissions(decoded.role, permissions)
      );

      if (!hasAccess) {
        return res.status(403).json({ 
          error: 'Insufficient permissions for this action' 
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
};

/**
 * Middleware: Allow any authenticated user
 */
export const requireAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
