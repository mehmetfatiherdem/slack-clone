import express from 'express';
import { signIn, signOutApp, signOutWorkspace } from '../controllers/User';
const router = express.Router();

router.post('/signin', signIn);
router.get('/signout-app', signOutApp);
router.get('/signout-workspace', signOutWorkspace);

export default router;
