import express from 'express';
import authRoutes from './Auth';
import userRoutes from './User';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
