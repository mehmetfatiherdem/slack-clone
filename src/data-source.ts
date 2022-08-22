import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Channel } from './entity/Channel';
import { DirectMessage } from './entity/DirectMessage';
import { Message } from './entity/Message';
import { PrivateMessage } from './entity/PrivateMessage';
import { User } from './entity/User';
import { WorkSpace } from './entity/WorkSpace';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.NODE_ENV == 'production' ? process.env.DATABASE_URL : process.env.DB_URL,
  synchronize: true,
  logging: false,
  entities: [User, Channel, DirectMessage, Message, WorkSpace, PrivateMessage],
  migrations: [],
  subscribers: [],
});
