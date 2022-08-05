import express from 'express';
import authRoutes from './Auth';
import userRoutes from './User';
import workSpaceRoutes from './WorkSpace';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workSpaceRoutes);

export default router;
