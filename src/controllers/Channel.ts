import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Channel } from '../entity/Channel';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const getChannel = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { channelId } = req.params;
  const channelRepo = AppDataSource.getRepository(Channel);

  const channel = await channelRepo.findOne({
    where: { id: channelId },
    relations: ['users', 'messages', 'messages.user'],
  });

  if (!channel) res.status(422).json({ message: 'channel could not fetched' });

  res.json({
    message: 'channel is fetched',
    data: channel.serializedBasicInfo,
  });
};
