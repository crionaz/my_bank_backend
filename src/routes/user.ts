import express from 'express';
import { authenticate, authorize } from '@middleware/auth';
import {
  getAllAccounts,
  updateAccountStatus,
} from '@/controllers/adminController';

const router = express.Router();

// Placeholder routes - implement as needed
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'User routes working' });
});

router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin routes working' });
});

// exmaple for this api id/status?action='freeze'
router.put(
  '/admin/account/:id/status',
  authenticate,
  authorize('admin'),
  updateAccountStatus
);

// view all accounts
router.get(
  '/accounts',
  authenticate,
  authenticate,
  authorize('admin'),
  getAllAccounts
);
export default router;
