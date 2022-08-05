import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IGetUserAuthInfoRequest } from '../../helpers/type';

export const isLoggedIn = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next
) => {
  const { appToken } = req.signedCookies;

  if (!appToken) {
    return res.status(401).json({ message: 'The user is not authenticated' });
  }
  try {
    const user = jwt.verify(appToken, process.env.JWT_SECRET);
    if (user) req.user = user;
    return next();
  } catch (err) {
    return res
      .clearCookie('app_token')
      .status(422)
      .json({ error: 'Invalid token' });
  }
};