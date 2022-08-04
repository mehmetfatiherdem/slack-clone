import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  Entity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
