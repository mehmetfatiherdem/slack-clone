import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { DirectMessage } from '../entity/DirectMessage';
import { Message } from '../entity/Message';
import { PrivateMessage } from '../entity/PrivateMessage';
import { User } from '../entity/User';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const getDirectMessage = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { userId } = req.params;

  const userRepo = AppDataSource.getRepository(User);
  const privateMessageRepo = AppDataSource.getRepository(PrivateMessage);

  const sender = await userRepo.findOne({
    where: { id: req.user.id },
    relations: {
      privateMessagesReceived: true,
      privateMessagesSent: true,
      directMessages: true,
      directMessageList: true,
    },
  });

  const receiver = await userRepo.findOne({
    where: { id: userId },
    relations: {
      privateMessagesReceived: true,
      privateMessagesSent: true,
      directMessages: true,
      directMessageList: true,
    },
  });

  const privateMessages = await privateMessageRepo.find({
    where: { sender, receiver },
  });

  res.json({
    message: 'direct messages retrieved successfully',
    data: privateMessages,
  });
};

export const sendPrivateMessage = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { text, receiverId } = req.body;
  const userRepo = AppDataSource.getRepository(User);

  const sender = await userRepo.findOne({
    where: { id: req.user.id },
    relations: { directMessages: true, directMessageList: true },
  });

  const receiver = await userRepo.findOne({
    where: { id: receiverId },
    relations: { directMessages: true, directMessageList: true },
  });

  await AppDataSource.transaction(async (transactionalEntityManager) => {
    if (!sender.directMessageList) {
      const directMessageList = new DirectMessage();
      directMessageList.owner = sender;
      directMessageList.users = [];
      directMessageList.users.push(receiver);
      sender.directMessageList = directMessageList;
      await transactionalEntityManager.save(directMessageList);
    }

    if (!receiver.directMessageList) {
      const directMessageList = new DirectMessage();
      directMessageList.owner = receiver;
      directMessageList.users = [];
      directMessageList.users.push(sender);
      receiver.directMessageList = directMessageList;
      await transactionalEntityManager.save(directMessageList);
    }

    const privateMessage = new PrivateMessage();
    privateMessage.text = text;
    privateMessage.receiver = receiver;
    privateMessage.sender = sender;

    if (privateMessage.directMessages?.length > 0) {
      privateMessage.directMessages.push(
        sender.directMessageList,
        receiver.directMessageList
      );
    } else {
      privateMessage.directMessages = [];
      privateMessage.directMessages.push(
        sender.directMessageList,
        receiver.directMessageList
      );
    }

    await transactionalEntityManager.save(privateMessage);
  });

  return res.json({ message: 'private message sent' });
};
