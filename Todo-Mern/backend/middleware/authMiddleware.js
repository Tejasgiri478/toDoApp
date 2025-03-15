import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Admin from '../models/adminModel.js';

// Protect routes - for both users and admins
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if this is an admin token
      if (decoded.isAdmin) {
        // Find admin by id
        req.admin = await Admin.findById(decoded.id).select('-password');
        req.isAdmin = true;
      } else {
        // Find user by id
        req.user = await User.findById(decoded.id).select('-password');
        req.isAdmin = false;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin only middleware
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
});

export { protect, adminOnly }; 