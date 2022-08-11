import express from 'express';
import { getChannel } from '../controllers/Channel';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.get('/:channelId', isLoggedIn, getChannel);

export default router;
