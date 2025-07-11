import express from 'express';
import { authenticate, authorize } from '@middleware/auth';

const router = express.Router();

// Placeholder routes - implement as needed
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'User routes working' });
});

router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin routes working' });
});

export default router;
