import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Channel } from '../entity/Channel';
import { Message } from '../entity/Message';
import { User } from '../entity/User';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const createMessage = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { text, channelId } = req.body;

  if (text == '')
    res.status(422).json({ message: 'Cannot send empty message' });

  const messageRepo = AppDataSource.getRepository(Message);
  const userRepo = AppDataSource.getRepository(User);
  const channelRepo = AppDataSource.getRepository(Channel);

  const message = new Message();
  message.text = text;
  message.user = req.user;

  const user = await userRepo.findOneBy({ id: req.user.id });

  user.messages = [];
  user.messages.push(message);

  const channel = await channelRepo.findOneBy({ id: channelId });

  message.channel = channel;

  if (channel.messages?.length > 0) {
    channel.messages.push(message);
  } else {
    channel.messages = [];
    channel.messages.push(message);
  }

  await messageRepo.save(message);

  res.json({ message: 'message created' });
};
