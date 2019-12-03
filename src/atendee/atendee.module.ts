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
    TypeOrmModule
  ],
  controllers: [AtendeeController]
})
export class AtendeeModule { }
