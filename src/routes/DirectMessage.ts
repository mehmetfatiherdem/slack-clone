import express from 'express';
import { getDirectMessage } from '../controllers/DirectMessages';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.get('/:userId', isLoggedIn, getDirectMessage);

export default router;
