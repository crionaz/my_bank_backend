import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './user';
import accountRoutes from './account';
import transactionRoutes from './transaction';
import adminRoutes from './admin';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/admin', adminRoutes);

export default router;
