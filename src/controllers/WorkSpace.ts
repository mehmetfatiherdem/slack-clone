import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { WorkSpace } from '../entity/WorkSpace';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const createWorkSpace = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { name } = req.body;
  const workSpaceRepo = AppDataSource.getRepository(WorkSpace);
  const userRepo = AppDataSource.getRepository(User);

  const workSpace = new WorkSpace();
  workSpace.name = name;
  workSpace.signedInUsers.push(req.user);

  const authUser = await userRepo.findOneBy({ id: req.user.id });

  authUser.workSpaces.push(workSpace);

  await workSpaceRepo.save(workSpace);

  res.json({
    message: 'Workspace created',
    data: workSpace.serializedBasicInfo,
  });
};

export const getWorkSpaces = (req: IGetUserAuthInfoRequest, res: Response) => {
  res.send('workspaces retrieved');
};

export const getWorkSpace = (req: IGetUserAuthInfoRequest, res: Response) => {
  res.send('workspaces retrieved');
};
