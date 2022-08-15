import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Entity,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { DirectMessage } from './DirectMessage';
import { User } from './User';

@Entity()
export class PrivateMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  text: string;

  @ManyToOne(() => User, (user) => user.privateMessagesSent, { nullable: true })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => User, (user) => user.privateMessagesReceived, {
    nullable: true,
  })
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @ManyToMany(() => DirectMessage, (directMessage) => directMessage.messages, {
    nullable: true,
  })
  directMessages: DirectMessage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
