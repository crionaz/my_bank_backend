import express from 'express';
import { authenticate } from '@middleware/auth';
import {
  createTransaction,
  getTransactions,
} from '../controllers/transactionController';
import { validateTransaction } from '../middleware/validation/validateTransaction';
import { validateRequest } from '../middleware/validateRequest';

const router = express.Router();

router.post('/', validateTransaction, validateRequest, createTransaction);
router.get('/', getTransactions);

export default router;
