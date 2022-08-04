import { Request } from 'express';
import { User } from '../entity/User';

export interface IGetUserAuthInfoRequest extends Request {
  user: User;
}
