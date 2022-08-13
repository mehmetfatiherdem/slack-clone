import { Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { IGetUserAuthInfoRequest } from '../helpers/type';

export const getUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOneBy({ id: req.user.id });
  res.json(user);
};
