import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { AtendeeModule } from '../atendee/atendee.module';
import {DemandModule} from '../demand/demand.module';

@Module({

  imports: [
      AtendeeModule,
      DemandModule,
  ],
  providers: [
    AgencyService,
  ],
  exports: [
  ],
  controllers: [AgencyController],
})
export class AgencyModule { }
