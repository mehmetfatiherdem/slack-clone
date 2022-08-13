import express from 'express';
const router = express.Router();
import {
  createWorkSpace,
  getWorkSpace,
  createChannel,
  joinWorkspace,
} from '../controllers/WorkSpace';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';

router.post('/create', isLoggedIn, createWorkSpace);
router.get('/:workspaceId', isLoggedIn, getWorkSpace);
router.post('/:workspaceId/create-channel', isLoggedIn, createChannel);
router.get('/:workspaceId/join/:code', isLoggedIn, joinWorkspace);

export default router;
