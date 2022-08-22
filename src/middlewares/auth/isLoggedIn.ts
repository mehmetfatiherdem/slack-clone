import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { IGetUserAuthInfoRequest } from '../../helpers/type';

export const isLoggedIn = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const { app_token } = req.signedCookies;

  if (!app_token) {
    return res.redirect('/');
  }
  try {
    const user = jwt.verify(app_token, process.env.JWT_SECRET);
    if (user) req.user = user;
    return next();
  } catch (err) {
    return res
      .clearCookie('app_token')
      .status(422)
      .json({ error: 'Invalid token' });
  }
};
