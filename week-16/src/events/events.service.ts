import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto.js';
import { Event } from './entities/event.entity.js';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({ relations: { user: true } });
  }

  create(createEventDto: CreateEventDto, userId: number): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      user: { id: userId },
    });

    return this.eventsRepository.save(event);
  }
}
