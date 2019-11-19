import { AtendeeRepository } from './atendee/atendee.repository';

import { Module } from '@nestjs/common';
import { AtendeeService } from './atendee/atendee.service';
import { AtendeeController } from './atendee/atendee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atendee } from './atendee.entity';

@Module({

  imports: [
    TypeOrmModule.forFeature([Atendee])
  ],
  providers: [
    AtendeeService
  ],
  exports: [
    AtendeeService
  ],
  controllers: [AtendeeController]
})
export class AtendeeModule { }
