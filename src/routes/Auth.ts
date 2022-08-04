import express from 'express';
import passport from '../auth/Passport';
const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'openid', 'email'],
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

export default router;
