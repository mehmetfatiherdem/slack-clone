import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Channel } from '../entity/Channel';
import { User } from '../entity/User';
import { WorkSpace } from '../entity/WorkSpace';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const createChannel = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  // FIXME: get workspace also
  const { channelName } = req.body;
  const channelRepo = AppDataSource.getRepository(Channel);
  const userRepo = AppDataSource.getRepository(User);

  const channel = new Channel();
  channel.name = channelName;
  channel.users = [];
  channel.users.push(req.user);

  const authUser = await userRepo.findOneBy({ id: req.user.id });

  authUser.channels = [];
  authUser.channels.push(channel);

  await channelRepo.save(channel);
};
