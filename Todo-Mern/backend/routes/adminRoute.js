import express from "express";
import { 
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
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin authentication routes
router.post('/login', adminLogin);

// Super admin password reset route (public route with secret key protection)
router.post('/reset-superadmin', resetSuperAdminPassword);

// Dashboard routes - require both authentication and admin role
router.get('/dashboard', protect, adminOnly, getDashboardStats);

// User management routes - require both authentication and admin role
router.get('/users', protect, adminOnly, getAllUsers);
router.post('/users', protect, adminOnly, createUser);
router.put('/users/:id', protect, adminOnly, updateUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

// Task management routes - require both authentication and admin role
router.get('/tasks', protect, adminOnly, getAllTasks);
router.post('/tasks', protect, adminOnly, createTask);
router.put('/tasks/:id', protect, adminOnly, updateTask);
router.delete('/tasks/:id', protect, adminOnly, deleteTask);
router.patch('/tasks/:id/toggle-status', protect, adminOnly, toggleTaskStatus);

// Admin profile and settings routes
router.get('/profile', protect, adminOnly, getAdminProfile);
router.put('/profile', protect, adminOnly, updateAdminProfile);
router.put('/change-password', protect, adminOnly, changeAdminPassword);

export default router; 