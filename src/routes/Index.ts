import express from 'express';
import authRoutes from './Auth';
import userRoutes from './User';
import workSpaceRoutes from './WorkSpace';
import channelRoutes from './Channel';
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workspaces', workSpaceRoutes);
router.use('/channels', channelRoutes);

export default router;
