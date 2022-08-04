import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Channel } from './Channel';
import { DirectMessage } from './DirectMessage';
import { Message } from './Message';
import { WorkSpace } from './WorkSpace';

export enum UserRole {
  ADMIN = 'admin',
  NORMAL = 'normal',
}

export enum UserStatus {
  ACTIVE = 'Active',
  AWAY = 'Away',
  IN_A_MEETING = 'In a meeting',
  COMMUTING = 'Commuting',
  OUT_SICK = 'Out sick',
  VACATIONING = 'Vacationing',
  WORKING_REMOTELY = 'Working remotely',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NORMAL,
  })
  role: string;

  @Column()
  provider: string;

  @Column()
  providerId: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: string;

  @OneToMany(() => Message, (message) => message.user, {
    nullable: true,
    cascade: true,
  })
  messages: Message[];

  @ManyToMany(() => Channel, (channel) => channel.users, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  channels: Channel[];

  @ManyToMany(() => DirectMessage, (directMessage) => directMessage.users, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  directMessages: DirectMessage[];

  @ManyToMany(() => WorkSpace, (workSpace) => workSpace.users, {
    nullable: true,
    cascade: true,
  })
  @JoinTable()
  workSpaces: WorkSpace[];

  @ManyToMany(() => WorkSpace, (workSpace) => workSpace.signedInUsers, {
    nullable: true,
  })
  signedInWorkSpaces: WorkSpace[];

  @OneToOne(() => DirectMessage, (directMessage) => directMessage.owner, {
    nullable: true,
    cascade: true,
  })
  directMessageList: DirectMessage;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
