import express from "express"
import { forgotPassword, resetPassword } from "../controllers/forgotPasswordController.js"
import { validate } from '../middleware/validator.js';
import { forgotPasswordSchema, resetPasswordSchema } from '../schemas/userSchema.js';

const router = express.Router();

// Request password reset
router.post("/forgotPassword", validate(forgotPasswordSchema), forgotPassword);

// Reset password with token
router.post("/resetPassword", validate(resetPasswordSchema), resetPassword);

export default router;