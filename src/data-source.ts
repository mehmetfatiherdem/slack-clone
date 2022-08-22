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
  url: process.env.NODE_ENV == 'production' ? process.env.DATABASE_URL : '',
  host:
    process.env.NODE_ENV == 'production'
      ? process.env.CLOUD_DB_HOST
      : 'localhost',
  port:
    process.env.NODE_ENV == 'production'
      ? parseInt(process.env.CLOUD_DB_PORT)
      : parseInt(process.env.DB_PORT),
  username:
    process.env.NODE_ENV == 'production'
      ? process.env.CLOUD_DB_USERNAME
      : process.env.DB_USERNAME,
  password:
    process.env.NODE_ENV == 'production'
      ? process.env.CLOUD_DB_PASSWORD
      : process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV == 'production'
      ? process.env.CLOUD_DB_NAME
      : process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Channel, DirectMessage, Message, WorkSpace, PrivateMessage],
  migrations: [],
  subscribers: [],
});
