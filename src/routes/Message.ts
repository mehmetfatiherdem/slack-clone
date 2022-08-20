import express from 'express';
import { createMessage } from '../controllers/Message';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
import { isWorkspaceMember } from '../middlewares/auth/isWorkspaceMember';
const router = express.Router();

router.post('/create', isLoggedIn, isWorkspaceMember, createMessage);

export default router;
