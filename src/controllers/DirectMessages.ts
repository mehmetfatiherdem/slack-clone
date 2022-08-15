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
      directMessages: true,
      directMessageList: true,
    },
  });

  res.json({
    message: 'direct messages retrieved successfully',
  });
};
