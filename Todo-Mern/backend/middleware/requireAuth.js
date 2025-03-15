import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        return next(new AppError('Authentication required. Please log in.', 401));
    }
    
    const token = authorization.split(' ')[1]+"";
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        return next(new AppError('Invalid or expired token. Please log in again.', 401));
    }
}

export default requireAuth;
