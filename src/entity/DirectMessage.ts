import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  Entity,
  OneToOne,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { PrivateMessage } from './PrivateMessage';
import { User } from './User';

@Entity()
export class DirectMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, (user) => user.directMessages, { nullable: true })
  users: User[];

  @OneToOne(() => User, (user) => user.directMessageList, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToMany(
    () => PrivateMessage,
    (privateMessage) => privateMessage.directMessage,
    {
      nullable: true,
      cascade: true,
    }
  )
  @JoinTable()
  message: PrivateMessage;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
