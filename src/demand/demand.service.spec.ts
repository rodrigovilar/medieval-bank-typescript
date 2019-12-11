import { Test, TestingModule } from '@nestjs/testing';
import { DemandService } from './demand.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DemandModule} from './demand.module';
import {Demand} from './demand.entity';

describe('DemandService', () => {
  let service: DemandService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DemandModule,
        // database
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'burgosDB',
          entities: [Demand],
          synchronize: true,
        })],
    }).compile();

    service = module.get<DemandService>(DemandService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
