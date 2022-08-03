import { Request, Response } from 'express';

const signUp = (req: Request, res: Response) => {
  res.json({ message: 'sign up here' });
};

const signIn = (req: Request, res: Response) => {
  res.json({ message: 'sign in here' });
};

const signOut = (req: Request, res: Response) => {
  res.json({ message: 'sign out here' });
};

export { signUp, signIn, signOut };
