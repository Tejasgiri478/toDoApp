import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import adminModel from '../models/adminModel.js';

const requireAdminAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return next(new AppError('Authentication required. Please log in as admin.', 401));
    }
    
    const token = authorization.split(' ')[1]+"";
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the decoded token has admin role
        if (!decoded.isAdmin) {
            return next(new AppError('Access denied. Admin privileges required.', 403));
        }
        
        // Find admin in database
        const admin = await adminModel.findById(decoded.id);
        
        if (!admin) {
            return next(new AppError('Admin account not found.', 401));
        }
        
        // Attach admin to request object
        req.admin = admin;
        req.token = token;
        next();
    } catch (error) {
        return next(new AppError('Invalid or expired token. Please log in again.', 401));
    }
};

export default requireAdminAuth; 