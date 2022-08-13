import express from 'express';
import { getUser } from '../controllers/User';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
const router = express.Router();

router.get('/me', isLoggedIn, getUser);

export default router;
