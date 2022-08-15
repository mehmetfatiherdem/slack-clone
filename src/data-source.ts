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
  host: 'localhost',
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV == 'production' ? false : true,
  logging: false,
  entities: [User, Channel, DirectMessage, Message, WorkSpace, PrivateMessage],
  migrations: [],
  subscribers: [],
});
