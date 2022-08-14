import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { Message } from '../entity/Message';
import { User } from '../entity/User';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const getPrivateMessage = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  res.send('private message retrieved');
};
