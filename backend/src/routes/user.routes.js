import { Router } from 'express';
import {
  followUser,
  getProfile,
  unfollowUser,
  updateProfile
} from '../controllers/user.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:id', optionalAuth, getProfile);
router.put('/:id', authenticate, updateProfile);
router.post('/:id/follow', authenticate, followUser);
router.delete('/:id/follow', authenticate, unfollowUser);

export default router;
