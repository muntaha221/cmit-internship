import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(createEventDto: CreateEventDto) {
    const newEvent = new this.eventModel(createEventDto);
    return newEvent.save();
  }

  async findAll() {
    return this.eventModel.find().exec();
  }
}
