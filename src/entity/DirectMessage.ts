import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  Entity,
  OneToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './User';

@Entity()
export class DirectMessage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => User, (user) => user.directMessages)
  users: User[];

  @OneToOne(() => User, (user) => user.directMessageList)
  @JoinColumn({name: 'ownerId'})
  owner: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
