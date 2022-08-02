import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Message } from './Message';
import { User } from './User';
import { WorkSpace } from './WorkSpace';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Message, (message) => message.channel)
  messages: Message[];

  @ManyToMany(() => User, (user) => user.channels)
  users: User;

  @ManyToOne(() => WorkSpace, (workspace) => workspace.channels)
  @JoinColumn()
  workSpace: WorkSpace;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
