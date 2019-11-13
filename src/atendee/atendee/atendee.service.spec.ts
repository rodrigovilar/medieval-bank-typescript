import { Test, TestingModule } from '@nestjs/testing';
import { AtendeeService } from './atendee.service';

describe('AtendeeService', () => {
  let service: AtendeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtendeeService],
    }).compile();

    service = module.get<AtendeeService>(AtendeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
