import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Message } from '../entity/Message';
import { User } from '../entity/User';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const getDirectMessage = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { userId } = req.params;

  const userRepo = AppDataSource.getRepository(User);
  const messageRepo = AppDataSource.getRepository(Message);

  const sender = await userRepo.findOne({
    where: { id: req.user.id },
    relations: {
      privateMessages: true,
      directMessages: true,
      directMessageList: true,
    },
  });

  const receiver = await userRepo.findOne({ where: { id: userId } });

  const sentMessages = await messageRepo.find({
    where: { user: sender, receiver: receiver },
  });

  const receivedMessages = await messageRepo.find({
    where: { user: receiver, receiver: sender },
  });

  const directMessages = [...sentMessages, ...receivedMessages];

  res.json({
    message: 'direct messages retrieved successfully',
    data: directMessages,
  });
};
