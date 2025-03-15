import adminModel from "../models/adminModel.js";
import userModel from "../models/userModel.js";
import taskModel from "../models/taskModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../middleware/errorHandler.js";
import logger from "../utils/logger.js";

// Create token
const createToken = (id, isAdmin = true) => {
    return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Admin login
const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return next(new AppError('Email and password are required', 400));
        }
        
        // Find admin by email
        const admin = await adminModel.findOne({ email });
        
        if (!admin) {
            return next(new AppError('Invalid email or password', 401));
        }
        
        // Check password
        const isMatch = await admin.comparePassword(password);
        
        if (!isMatch) {
            return next(new AppError('Invalid email or password', 401));
        }
        
        // Create token
        const token = createToken(admin._id);
        
        // Return admin info and token
        res.status(200).json({
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            token
        });
    } catch (error) {
        next(error);
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res, next) => {
    try {
        // Get counts
        const totalUsers = await userModel.countDocuments();
        const totalTasks = await taskModel.countDocuments();
        const completedTasks = await taskModel.countDocuments({ completed: true });
        const pendingTasks = totalTasks - completedTasks;
        
        // Get tasks by category
        const tasksByCategory = await taskModel.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Format tasks by category
        const formattedTasksByCategory = {};
        tasksByCategory.forEach(item => {
            formattedTasksByCategory[item._id || 'others'] = item.count;
        });
        
        // Get recent tasks
        const recentTasks = await taskModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email');
        
        // Return dashboard stats
        res.status(200).json({
            totalUsers,
            totalTasks,
            completedTasks,
            pendingTasks,
            tasksByCategory: formattedTasksByCategory,
            recentTasks
        });
    } catch (error) {
        next(error);
    }
};

// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Create a new user
const createUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate input
        if (!name || !email || !password) {
            return next(new AppError('Name, email and password are required', 400));
        }
        
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        
        if (existingUser) {
            return next(new AppError('User with this email already exists', 400));
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        });
        
        // Return new user without password
        res.status(201).json({
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt
        });
    } catch (error) {
        next(error);
    }
};

// Update a user
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        
        // Find user
        const user = await userModel.findById(id);
        
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        
        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        
        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        
        // Save updated user
        await user.save();
        
        // Return updated user without password
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        next(error);
    }
};

// Delete a user
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Find and delete user
        const user = await userModel.findByIdAndDelete(id);
        
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        
        // Delete all tasks associated with this user
        await taskModel.deleteMany({ userId: id });
        
        res.status(200).json({ message: 'User and associated tasks deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get all tasks
const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await taskModel.find().populate('userId', 'name email');
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

// Create a new task
const createTask = async (req, res, next) => {
    try {
        const { title, description, category, userId } = req.body;
        
        // Validate input
        if (!title || !userId) {
            return next(new AppError('Title and userId are required', 400));
        }
        
        // Check if user exists
        const user = await userModel.findById(userId);
        
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        
        // Create new task
        const newTask = await taskModel.create({
            title,
            description,
            category: category || 'others',
            completed: false,
            userId
        });
        
        // Return new task
        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

// Update a task
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, category, completed } = req.body;
        
        // Find task
        const task = await taskModel.findById(id);
        
        if (!task) {
            return next(new AppError('Task not found', 404));
        }
        
        // Update task fields
        if (title) task.title = title;
        if (description !== undefined) task.description = description;
        if (category) task.category = category;
        if (completed !== undefined) task.completed = completed;
        
        // Save updated task
        await task.save();
        
        // Return updated task
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Delete a task
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Find and delete task
        const task = await taskModel.findByIdAndDelete(id);
        
        if (!task) {
            return next(new AppError('Task not found', 404));
        }
        
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Toggle task status
const toggleTaskStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Find task
        const task = await taskModel.findById(id);
        
        if (!task) {
            return next(new AppError('Task not found', 404));
        }
        
        // Toggle completed status
        task.completed = !task.completed;
        
        // Save updated task
        await task.save();
        
        // Return updated task
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// Get admin profile
const getAdminProfile = async (req, res, next) => {
    try {
        // Get admin from request object (set by protect middleware)
        const admin = req.admin;
        
        if (!admin) {
            return next(new AppError('Admin not found', 404));
        }
        
        // Return admin info without password
        res.status(200).json({
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
    } catch (error) {
        next(error);
    }
};

// Update admin profile
const updateAdminProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        
        // Get admin from request object
        const admin = req.admin;
        
        if (!admin) {
            return next(new AppError('Admin not found', 404));
        }
        
        // Update admin fields
        if (name) admin.name = name;
        if (email) admin.email = email;
        
        // Save updated admin
        await admin.save();
        
        // Return updated admin without password
        res.status(200).json({
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
    } catch (error) {
        next(error);
    }
};

// Change admin password
const changeAdminPassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Validate input
        if (!currentPassword || !newPassword) {
            return next(new AppError('Current password and new password are required', 400));
        }
        
        // Get admin from request object
        const admin = await adminModel.findById(req.admin._id);
        
        if (!admin) {
            return next(new AppError('Admin not found', 404));
        }
        
        // Check current password
        const isMatch = await admin.comparePassword(currentPassword);
        
        if (!isMatch) {
            return next(new AppError('Current password is incorrect', 401));
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        
        // Save updated admin
        await admin.save();
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Reset super admin password
const resetSuperAdminPassword = async (req, res, next) => {
    try {
        const { secretKey, newPassword } = req.body;
        
        // Validate input
        if (!secretKey || !newPassword) {
            return next(new AppError('Secret key and new password are required', 400));
        }
        
        // Verify secret key matches environment variable
        const resetSecretKey = process.env.ADMIN_RESET_SECRET || 'super-secret-reset-key';
        
        if (secretKey !== resetSecretKey) {
            return next(new AppError('Invalid secret key', 401));
        }
        
        // Reset super admin password
        const result = await adminModel.resetSuperAdminPassword(newPassword);
        
        if (!result.success) {
            return next(new AppError(result.message, 400));
        }
        
        res.status(200).json({ message: result.message });
    } catch (error) {
        next(error);
    }
};

export {
    adminLogin,
    getDashboardStats,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    resetSuperAdminPassword
}; 