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

  const authUser = await userRepo.findOne({
    where: { id: req.user.id },
  });

  const receiver = await userRepo.findOne({
    where: { id: userId },
  });

  const messages = await privateMessageRepo
    .createQueryBuilder('privateMessage')
    .where(
      'privateMessage.sender = :sender AND privateMessage.receiver = :receiver',
      { sender: authUser.id, receiver: receiver.id }
    )
    .orWhere('privateMessage.sender = :s AND privateMessage.receiver = :r', {
      s: receiver.id,
      r: authUser.id,
    })
    .leftJoinAndSelect('privateMessage.sender', 'sender')
    .orderBy('privateMessage.createdAt', 'ASC')
    .getMany();

  if (!messages) {
    return res
      .status(422)
      .json({ message: 'could not fetch the private messages' });
  }

  res.json({
    message: 'direct messages retrieved successfully',
    data: messages,
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

  if (sender.id === receiver.id) {
    return res
      .status(422)
      .json({ message: 'you cannot send a message to yourself yet :_(' });
  }

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
