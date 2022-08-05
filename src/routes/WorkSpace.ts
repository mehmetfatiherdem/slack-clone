import express from 'express';
const router = express.Router();
import { createWorkSpace } from '../controllers/WorkSpace';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';

router.post('/create', isLoggedIn, createWorkSpace);

export default router;
