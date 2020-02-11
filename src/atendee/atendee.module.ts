import { Module } from '@nestjs/common';
import { AtendeeService } from './atendee/atendee.service';
import { AtendeeController } from './atendee/atendee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atendee } from './atendee.entity';
import {DemandModule} from '../demand/demand.module';
import { Demand } from '../demand/demand.entity';

@Module({

  imports: [
      DemandModule,
      TypeOrmModule.forFeature([Atendee, Demand]),
  ],
  providers: [
    AtendeeService,
  ],
  exports: [
    TypeOrmModule,
    AtendeeService,
  ],
  controllers: [AtendeeController],
})
export class AtendeeModule { }
