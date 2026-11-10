import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Event } from './entities/event.entity.js';
import { EventsService } from './events.service.js';
import { EventsController } from './events.controller.js';
import { EventsResolver } from './events.resolver.js';
import { GqlAuthGuard } from './gql-auth.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [EventsService, JwtAuthGuard, GqlAuthGuard, EventsResolver],
})
export class EventsModule {}
