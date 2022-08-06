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
  workSpace.users = [];
  workSpace.users.push(req.user);

  const authUser = await userRepo.findOneBy({ id: req.user.id });

  authUser.workSpaces = [];
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

export const getWorkSpace = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { workspaceId } = req.params;
  const workSpaceRepo = AppDataSource.getRepository(WorkSpace);

  const workSpace = await workSpaceRepo.findOne({
    relations: {
      users: true,
    },
    where: {
      id: workspaceId,
    },
  });

  if (!workSpace)
    res.status(422).json({ message: 'workspace could not fetched' });

  res.json({
    message: `workspace ${workSpace.name} retrieved successfully`,
    data: workSpace.serializedBasicInfo,
  });
};
