import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

@InputType('CreateEventInput')
export class CreateEventDto {
  @Field()
  @IsString()
  @MinLength(1)
  title: string;

  @Field()
  @IsString()
  @MinLength(1)
  location: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  capacity: number;
}
