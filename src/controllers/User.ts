import { Request, Response } from 'express';

export const signInApp = (req: Request, res: Response) => {
  // sign in by entering your mail address and get a 6-digit code
  res.json({ message: 'sign in here' });
};

export const signInWorkspace = (req: Request, res: Response) => {
  // sign in to a workspace
  res.json({ message: 'sign in here' });
};

export const signOutApp = (req: Request, res: Response) => {
  res.clearCookie('app_token');
  res.json({ message: 'Signed out from the app' });
};

export const signOutWorkspace = (req: Request, res: Response) => {
  // sign out from a workspace
  res.json({ message: 'Signed out from the workspace' });
};
