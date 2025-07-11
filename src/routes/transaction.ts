import express from 'express';
import { authenticate } from '@middleware/auth';

const router = express.Router();

// Placeholder routes - implement as needed
router.get('/', authenticate, (req, res) => {
  res.json({ message: 'Transaction routes working' });
});

export default router;
