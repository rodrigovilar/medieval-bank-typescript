import { Test, TestingModule } from '@nestjs/testing';
import { AtendeeServiceService } from '../src/Atendee/atendee-service/atendee-service.service';

describe('AtendeeServiceService', () => {
  let service: AtendeeServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtendeeServiceService],
    }).compile();

    service = module.get<AtendeeServiceService>(AtendeeServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
