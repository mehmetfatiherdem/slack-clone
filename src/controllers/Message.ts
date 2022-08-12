import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Message } from '../entity/Message';
import { User } from '../entity/User';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const createMessage = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { text } = req.body;
  const messageRepo = AppDataSource.getRepository(Message);
  const userRepo = AppDataSource.getRepository(User);

  const message = new Message();
  message.text = text;
  message.user = req.user;

  const user = await userRepo.findOneBy({ id: req.user.id });

  user.messages = [];
  user.messages.push(message);

  await messageRepo.save(message);

  res.json({ message: 'message created' });
};
