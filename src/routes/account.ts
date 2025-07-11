import express from 'express';
import { authenticate } from '@middleware/auth';
import {
  getAccountById,
  getAllAccounts,
  updateAccountById,
} from '@/controllers/accountController';

const router = express.Router();

// Placeholder routes - implement as needed
router.get('/', authenticate, getAllAccounts);
router.get('/:id', authenticate, getAccountById);
router.put('/:id', authenticate, updateAccountById);

export default router;
