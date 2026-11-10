import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { CreateEventDto } from './dto/create-event.dto.js';
import { Event } from './entities/event.entity.js';
import { EventsService } from './events.service.js';
import { GqlAuthGuard } from './gql-auth.guard.js';

interface GraphQLRequestContext {
  req: {
    user: {
      id: number;
    };
  };
}

@Resolver(() => Event)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [Event], { name: 'events' })
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Mutation(() => Event)
  @UseGuards(GqlAuthGuard)
  createEvent(
    @Args('createEventInput') createEventDto: CreateEventDto,
    @Context() context: GraphQLRequestContext,
  ): Promise<Event> {
    return this.eventsService.create(createEventDto, context.req.user.id);
  }
}
