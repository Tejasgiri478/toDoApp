import express from 'express';
import { loginUser, registerUser, getUser } from '../controllers/userController.js';
import requireAuth from '../middleware/requireAuth.js';
import { validate } from '../middleware/validator.js';
import { 
  loginSchema, 
  registerSchema, 
  updateProfileSchema 
} from '../schemas/userSchema.js';

const router = express.Router();

// Auth routes
router.post("/login", validate(loginSchema), loginUser);
router.post("/register", validate(registerSchema), registerUser);

// Protected routes
router.get("/getuser", requireAuth, getUser);

export default router;