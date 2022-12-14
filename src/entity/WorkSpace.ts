import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Channel } from './Channel';
import { User } from './User';

@Entity()
export class WorkSpace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  inviteCode: string;

  @OneToMany(() => Channel, (channel) => channel.workSpace, {
    nullable: true,
    cascade: true,
  })
  channels: Channel[];

  @ManyToMany(() => User, (user) => user.workSpaces, { nullable: true })
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  public get serializedBasicInfo() {
    //TODO: check if they are preloaded
    const { id, name, channels, users } = this;

    return {
      id,
      name,
      channels,
      users,
    };
  }
}
