import { Module } from '@nestjs/common';
import { AtendeeService } from './atendee/atendee.service';
import { AtendeeController } from './atendee/atendee.controller';

@Module({
  providers: [AtendeeService],
  controllers: [AtendeeController]
})
export class AtendeeModule {}
