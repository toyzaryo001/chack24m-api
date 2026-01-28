import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
// import walletRoutes from './wallet.routes';
// import gameRoutes from './games.routes';
// import adminRoutes from './admin';

const router = Router();

// Base routes
router.use('/', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// Wallet routes
// router.use('/wallet', walletRoutes);

// Game routes
// router.use('/games', gameRoutes);

// Admin routes
// router.use('/admin', adminRoutes);

export default router;
