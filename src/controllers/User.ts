import { Request, Response } from 'express';

const signIn = (req: Request, res: Response) => {
  // sign in with google or apple
  // or sign in by entering your mail address and get a 6-digit code
  res.json({ message: 'sign in here' });
};

const signOut = (req: Request, res: Response) => {
  // 1-sign out from slack app
  // 2-sign out from a workspace
  res.json({ message: 'sign out here' });
};

export { signIn, signOut };
