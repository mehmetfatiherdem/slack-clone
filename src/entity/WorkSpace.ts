import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  BaseEntity,
} from 'typeorm';
import { Channel } from './Channel';
import { User } from './User';

@Entity()
export class WorkSpace extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Channel, (channel) => channel.workSpace)
  channels: Channel[];

  @ManyToMany(() => User, (user) => user.workSpaces)
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
