import express from 'express';
import { authenticate, authorize } from '@middleware/auth';
import { validateUserStatusUpdate } from '@middleware/validation';
import { 
  getAllUsers, 
  freezeUser, 
  unfreezeUser, 
  getUserById, 
  updateUserStatus 
} from '@controllers/userController';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize('admin'));

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/freeze', freezeUser);
router.put('/users/:id/unfreeze', unfreezeUser);
router.put('/users/:id/status', validateUserStatusUpdate, updateUserStatus);

// Placeholder for transaction routes
router.get('/transactions', (req, res) => {
  res.json({ 
    success: true,
    message: 'Admin transaction routes - coming soon',
    data: []
  });
});

// Placeholder for audit logs routes
router.get('/audit-logs', (req, res) => {
  res.json({ 
    success: true,
    message: 'Admin audit logs routes - coming soon',
    data: []
  });
});

export default router;
