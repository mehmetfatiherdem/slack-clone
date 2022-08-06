import express from 'express';
const router = express.Router();
import { createWorkSpace, getWorkSpace } from '../controllers/WorkSpace';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';

router.post('/create', isLoggedIn, createWorkSpace);
router.get('/:workspaceId', isLoggedIn, getWorkSpace);

export default router;
