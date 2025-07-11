import express from 'express';
import { authenticate } from '@middleware/auth';
import {
  getAccountById,
  updateAccountById,
} from '@/controllers/accountController';

const router = express.Router();

// Placeholder routes - implement as needed

router.get('/:id', authenticate, getAccountById);
router.put('/:id', authenticate, updateAccountById);

export default router;
