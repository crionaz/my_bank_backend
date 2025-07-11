import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import accountRoutes from './account';
import transactionRoutes from './transaction';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);

export default router;
