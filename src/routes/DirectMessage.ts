import express from 'express';
import { getPrivateMessage } from '../controllers/DirectMessages';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.get('/:userId', isLoggedIn, getPrivateMessage);

export default router;
