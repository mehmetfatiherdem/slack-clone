import express from 'express';
import { createChannel } from '../controllers/Channel';
const router = express.Router();
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';

router.post('/create', isLoggedIn, createChannel);

export default router;
