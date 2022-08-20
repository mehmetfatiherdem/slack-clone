import express from 'express';
import { getChannel } from '../controllers/Channel';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
import { isWorkspaceMember } from '../middlewares/auth/isWorkspaceMember';
const router = express.Router();

router.get('/:channelId', isLoggedIn, isWorkspaceMember, getChannel);

export default router;
