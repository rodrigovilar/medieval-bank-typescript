import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgencyService } from './agency.service';
import { AgencyController } from './agency.controller';
import { AtendeeModule } from '../atendee/atendee.module';

@Module({

  imports: [
      AtendeeModule
  ],
  providers: [
    AgencyService
  ],
  exports: [
  ],
  controllers: [AgencyController]
})
export class AgencyModule { }
