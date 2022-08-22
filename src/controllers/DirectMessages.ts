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

  if (text == '')
    res.status(422).json({ message: 'Cannot send empty message' });

  const userRepo = AppDataSource.getRepository(User);

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

  //FIXME: handle a user sending messages to themselves

  await AppDataSource.transaction(async (transactionalEntityManager) => {
    if (!sender.directMessage) {
      const directMessage = new DirectMessage();
      directMessage.owner = sender;
      directMessage.users = [];
      directMessage.users.push(receiver);
      sender.directMessage = directMessage;

      if (!receiver.directMessageBelongTo) {
        receiver.directMessageBelongTo = [];
      }

      receiver.directMessageBelongTo.push(directMessage);

      await transactionalEntityManager.save(directMessage);
    } else {
      if (
        sender.directMessage.users.every((user) => {
          user.id !== receiver.id;
        })
      ) {
        sender.directMessage.users.push(receiver);

        if (!receiver.directMessageBelongTo) {
          receiver.directMessageBelongTo = [];
        }

        if (
          receiver.directMessageBelongTo.every((dm) => {
            dm.id !== sender.directMessage.id;
          })
        ) {
          receiver.directMessageBelongTo.push(sender.directMessage);
        }
        await transactionalEntityManager.save(sender.directMessage);
      }
    }

    if (!receiver.directMessage) {
      const directMessage = new DirectMessage();
      directMessage.owner = receiver;
      directMessage.users = [];
      directMessage.users.push(sender);
      receiver.directMessage = directMessage;

      if (!sender.directMessageBelongTo) {
        sender.directMessageBelongTo = [];
      }

      sender.directMessageBelongTo.push(directMessage);

      await transactionalEntityManager.save(directMessage);
    } else {
      if (
        receiver.directMessage.users.every((user) => {
          user.id !== sender.id;
        })
      ) {
        receiver.directMessage.users.push(sender);

        if (!sender.directMessageBelongTo) {
          sender.directMessageBelongTo = [];
        }

        if (
          sender.directMessageBelongTo.every((dm) => {
            dm.id !== receiver.directMessage.id;
          })
        ) {
          sender.directMessageBelongTo.push(receiver.directMessage);
        }

        await transactionalEntityManager.save(receiver.directMessage);
      }
    }

    const privateMessage = new PrivateMessage();
    privateMessage.text = text;
    privateMessage.receiver = receiver;
    privateMessage.sender = sender;
    privateMessage.directMessages = [];
    privateMessage.directMessages.push(sender.directMessage);
    privateMessage.directMessages.push(receiver.directMessage);

    if (!sender.privateMessagesSent) {
      sender.privateMessagesSent = [];
    }

    sender.privateMessagesSent.push(privateMessage);

    if (!receiver.privateMessagesReceived) {
      receiver.privateMessagesReceived = [];
    }
    receiver.privateMessagesReceived.push(privateMessage);

    await transactionalEntityManager.save(privateMessage);
  });

  res.json({ message: 'private message sent' });
};
