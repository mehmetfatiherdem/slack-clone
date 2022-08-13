import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Channel } from '../entity/Channel';
import { User } from '../entity/User';
import { WorkSpace } from '../entity/WorkSpace';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const createWorkSpace = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  /*
  const { name } = req.body;
  const workSpaceRepo = AppDataSource.getRepository(WorkSpace);
  const userRepo = AppDataSource.getRepository(User);

  const { randomBytes } = await import('crypto');

  const key = randomBytes(48).toString('hex');

  const workSpace = new WorkSpace();
  workSpace.name = name;
  workSpace.inviteCode = key;
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
  */
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
      channels: true,
    },
    where: {
      id: workspaceId,
    },
  });

  if (!workSpace)
    res.status(422).json({ message: 'workspace could not fetched' });

  const { randomBytes } = await import('crypto');

  const key = randomBytes(48).toString('hex');

  console.log(key);

  res.render('workspace.ejs', {
    workSpace,
    inviteLink: `http://localhost:3000/api/workspaces/${workSpace.id}/join/${workSpace.inviteCode}`,
  });
};

export const createChannel = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { workspaceId } = req.params;
  const { channelName } = req.body;
  const channelRepo = AppDataSource.getRepository(Channel);
  const userRepo = AppDataSource.getRepository(User);
  const workspaceRepo = AppDataSource.getRepository(WorkSpace);

  const channel = new Channel();
  channel.name = channelName;
  channel.users = [];
  channel.users.push(req.user);

  const authUser = await userRepo.findOneBy({ id: req.user.id });

  authUser.channels = [];
  authUser.channels.push(channel);

  const workspace = await workspaceRepo.findOne({ where: { id: workspaceId } });

  workspace.channels = [];
  workspace.channels.push(channel);

  channel.workSpace = workspace;

  await channelRepo.save(channel);

  res.json(channel.name);
};

export const joinWorkspace = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { workspaceId, code } = req.params;

  const workspaceRepo = AppDataSource.getRepository(WorkSpace);
  const userRepo = AppDataSource.getRepository(User);

  const workspace = await workspaceRepo.findOne({
    where: { id: workspaceId },
    relations: { users: true },
  });

  if (workspace.inviteCode != code) {
    return res.status(422).json({ message: 'invite link is wrong' });
  }
  if (workspace.users?.length > 0) console.log('user exist');
  workspace.users.push(req.user);

  const authUser = await userRepo.findOne({
    where: { id: req.user.id },
    relations: { workSpaces: true },
  });

  if (authUser.workSpaces?.length > 0) {
    authUser.workSpaces.push(workspace);
  } else {
    authUser.workSpaces = [];
    authUser.workSpaces.push(workspace);
  }

  await workspaceRepo.save(workspace);

  return res.send('joined');
};
