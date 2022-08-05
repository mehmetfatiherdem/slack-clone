import express from 'express';
import {
  signInApp,
  signInWorkspace,
  signOutApp,
  signOutWorkspace,
} from '../controllers/User';
const router = express.Router();

router.post('/signin-app', signInApp);
router.post('/signin-workspace', signInWorkspace);
router.get('/signout-app', signOutApp);
router.get('/signout-workspace', signOutWorkspace);

export default router;
