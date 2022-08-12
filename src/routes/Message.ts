import express from 'express';
import { createMessage } from '../controllers/Message';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.post('/create', isLoggedIn, createMessage);

export default router;
