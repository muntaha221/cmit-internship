import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User as UserEntity } from '../../users/entities/user.entity.js';
import type { User } from '../../users/entities/user.entity.js';

@ObjectType()
@Entity('events')
export class Event {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  location: string;

  @Field(() => Int)
  @Column()
  capacity: number;

  @ManyToOne(() => UserEntity, (user) => user.events, { nullable: false })
  user: User;
}
