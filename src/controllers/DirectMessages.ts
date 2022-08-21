import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { DirectMessage } from '../entity/DirectMessage';
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
  });

  const receiver = await userRepo.findOne({
    where: { id: userId },
  });

  // FIXME: where: {sender, receiver} doesn't work??
  const privateMessages = await privateMessageRepo.find({
    relations: ['sender', 'receiver'],
  });

  res.json({
    message: 'direct messages retrieved successfully',
    data: privateMessages.filter(
      (msg) => msg.sender.id === sender.id && msg.receiver.id === userId
    ),
  });
};

export const sendPrivateMessage = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  const { text, receiverId } = req.body;
  const userRepo = AppDataSource.getRepository(User);
  const directMessageRepo = AppDataSource.getRepository(DirectMessage);
  const privateMessageRepo = AppDataSource.getRepository(PrivateMessage);

  const sender = await userRepo.findOne({
    where: { id: req.user.id },
    relations: [
      'directMessage',
      'directMessage.users',
      'directMessageBelongTo',
    ],
  });

  const receiver = await userRepo.findOne({
    where: { id: receiverId },
    relations: [
      'directMessage',
      'directMessage.users',
      'directMessageBelongTo',
    ],
  });

  if (!sender.directMessage) {
    const directMessage = new DirectMessage();
    directMessage.owner = sender;
    directMessage.users = [];
    directMessage.users.push(receiver);
    sender.directMessage = directMessage;
    await directMessageRepo.save(directMessage);
  } else {
    sender.directMessage.users.push(receiver);
    await directMessageRepo.save(sender.directMessage);
  }

  if (!receiver.directMessage) {
    const directMessage = new DirectMessage();
    directMessage.owner = receiver;
    directMessage.users = [];
    directMessage.users.push(sender);
    receiver.directMessage = directMessage;
    await directMessageRepo.save(directMessage);
  } else {
    receiver.directMessage.users.push(sender);
    await directMessageRepo.save(receiver.directMessage);
  }

  const privateMessage = new PrivateMessage();
  privateMessage.text = text;
  privateMessage.receiver = receiver;
  privateMessage.sender = sender;
  privateMessage.directMessages = [];
  privateMessage.directMessages.push(sender.directMessage);
  privateMessage.directMessages.push(receiver.directMessage);

  if (sender.privateMessagesSent?.length > 0) {
    sender.privateMessagesSent.push(privateMessage);
  } else {
    sender.privateMessagesSent = [];
    sender.privateMessagesSent.push(privateMessage);
  }

  if (receiver.privateMessagesReceived?.length > 0) {
    receiver.privateMessagesReceived.push(privateMessage);
  } else {
    receiver.privateMessagesReceived = [];
    receiver.privateMessagesReceived.push(privateMessage);
  }

  await privateMessageRepo.save(privateMessage);

  /*
  await AppDataSource.transaction(async (transactionalEntityManager) => {
    if (!sender.directMessage) {
      const directMessage = new DirectMessage();
      directMessage.owner = sender;
      directMessage.users = [];
      directMessage.users.push(receiver);
      sender.directMessage = directMessage;
      await transactionalEntityManager.save(directMessage);
    } else {
      sender.directMessage.users.push(receiver);
      await transactionalEntityManager.save(sender.directMessage);
    }

    if (!receiver.directMessage) {
      const directMessage = new DirectMessage();
      directMessage.owner = receiver;
      directMessage.users = [];
      directMessage.users.push(sender);
      receiver.directMessage = directMessage;
      await transactionalEntityManager.save(directMessage);
    } else {
      receiver.directMessage.users.push(sender);
      await transactionalEntityManager.save(receiver.directMessage);
    }

    const privateMessage = new PrivateMessage();
    privateMessage.text = text;
    privateMessage.receiver = receiver;
    privateMessage.sender = sender;
    privateMessage.directMessages = [];
    privateMessage.directMessages.push(sender.directMessage);
    privateMessage.directMessages.push(receiver.directMessage);

    if (sender.privateMessagesSent?.length > 0) {
      sender.privateMessagesSent.push(privateMessage);
    } else {
      sender.privateMessagesSent = [];
      sender.privateMessagesSent.push(privateMessage);
    }

    if (receiver.privateMessagesReceived?.length > 0) {
      receiver.privateMessagesReceived.push(privateMessage);
    } else {
      receiver.privateMessagesReceived = [];
      receiver.privateMessagesReceived.push(privateMessage);
    }

    await transactionalEntityManager.save(privateMessage);
  });
  */

  res.json({ message: 'private message sent' });
};
