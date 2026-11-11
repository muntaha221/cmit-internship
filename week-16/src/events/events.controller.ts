import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Post()
  create(
    @Body() createEventDto: CreateEventDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.eventsService.create(createEventDto, request.user.id);
  }
}
