import { Router } from 'express';
import {
  forgotPassword,
  login,
  logout,
  me,
  resetPassword,
  signup
} from '../controllers/auth.controller.js';
import { signupValidator, loginValidator } from '../utils/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/signup', authLimiter, signupValidator, signup);
router.post('/login', authLimiter, loginValidator, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

export default router;

