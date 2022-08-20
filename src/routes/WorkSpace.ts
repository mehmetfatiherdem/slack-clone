import express from 'express';
const router = express.Router();
import {
  createWorkSpace,
  getWorkSpace,
  createChannel,
  joinWorkspace,
  signoutWorkspace,
} from '../controllers/WorkSpace';
import { isLoggedIn } from '../middlewares/auth/isLoggedIn';
import { isWorkspaceMember } from '../middlewares/auth/isWorkspaceMember';

router.post('/create', isLoggedIn, createWorkSpace);
router.get('/signout-workspace', isLoggedIn, isWorkspaceMember, signoutWorkspace)
router.get('/:workspaceId', isLoggedIn, getWorkSpace);
router.post('/:workspaceId/create-channel', isLoggedIn, createChannel);
router.get('/:workspaceId/join/:code', isLoggedIn, joinWorkspace);

export default router;
