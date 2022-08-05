import express from 'express';
import passport from '../auth/Passport';
import jwt from 'jsonwebtoken';
import { IGetUserAuthInfoRequest } from '../helpers/type';
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'openid', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  function (req: IGetUserAuthInfoRequest, res) {
    // Successful authentication, redirect home.
    const { id } = req.user;

    const cookieAge = 14 * 24 * 3600;

    const appToken = jwt.sign(
      {
        id: id,
        role: 'normal',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: cookieAge,
      }
    );

    res.cookie('app_token', appToken, {
      maxAge: cookieAge,
      httpOnly: true,
      signed: true,
    });

    res.redirect('/');
  }
);

export default router;
