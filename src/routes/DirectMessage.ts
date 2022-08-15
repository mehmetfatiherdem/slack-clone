import express from 'express';
import {
  getDirectMessage,
  sendPrivateMessage,
} from '../controllers/DirectMessages';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.get('/:userId', isLoggedIn, getDirectMessage);
router.post('/send', isLoggedIn, sendPrivateMessage);

export default router;
