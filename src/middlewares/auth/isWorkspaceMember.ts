import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { IGetUserAuthInfoRequest } from '../../helpers/type';
import { AppDataSource } from '../../data-source';
import { User } from '../../entity/User';
import { WorkSpace } from '../../entity/WorkSpace';

export const isWorkspaceMember = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const { workspace_token } = req.signedCookies;
  if (!workspace_token) {
    return res
      .status(401)
      .json({ message: 'The workspace auth could not found' });
  }
  const userRepo = AppDataSource.getRepository(User);
  const workspaceRepo = AppDataSource.getRepository(WorkSpace);
  const authUser = await userRepo.findOne({
    where: { id: req.user.id },
    relations: ['workSpaces'],
  });

  try {
    const user = jwt.verify(workspace_token, process.env.JWT_SECRET);

    const workspace = await workspaceRepo.findOne({
      where: { id: user.workspaceId },
    });

    const isMember = authUser.workSpaces.find((ws) => {
      return ws.id === workspace.id;
    });

    if (isMember) return next();
  } catch (err) {
    // TODO: check why this is not fired
    return res
      .clearCookie('workspace_token')
      .status(422)
      .json({ error: 'Invalid token' });
  }
};
