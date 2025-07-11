import express from 'express';
import { authenticate, authorize } from '@middleware/auth';
import { 
  getUserProfile, 
  updateUserProfile, 
  getAllUsers, 
  freezeUser, 
  unfreezeUser, 
  getUserById, 
  updateUserStatus 
} from '@controllers/userController';
import { validateProfileUpdate } from '@middleware/validation';

const router = express.Router();

// User profile routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, validateProfileUpdate, updateUserProfile);

export default router;
