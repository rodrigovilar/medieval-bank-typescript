import { Module } from '@nestjs/common';
import { DemandService } from './demand.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Demand} from './demand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Demand])],
  providers: [DemandService],
  exports: [
      TypeOrmModule,
      DemandService,
  ],
})
export class DemandModule {}
