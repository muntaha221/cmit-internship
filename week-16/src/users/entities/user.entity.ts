import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event as EventEntity } from '../../events/entities/event.entity.js';
import type { Event } from '../../events/entities/event.entity.js';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Field(() => [EventEntity], { nullable: true })
  @OneToMany(() => EventEntity, (event) => event.user)
  events: Event[];
}
