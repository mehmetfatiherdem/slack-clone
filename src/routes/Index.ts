import express from 'express';
import authRoutes from './Auth';
const router = express.Router();

router.use('/auth', authRoutes);

export default router;
