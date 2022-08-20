import express from 'express';
import {
  getDirectMessage,
  sendPrivateMessage,
} from '../controllers/DirectMessages';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
import { isWorkspaceMember } from '../middlewares/auth/isWorkspaceMember';
const router = express.Router();

router.get('/:userId', isLoggedIn, isWorkspaceMember, getDirectMessage);
router.post('/send', isLoggedIn, isWorkspaceMember, sendPrivateMessage);

export default router;
