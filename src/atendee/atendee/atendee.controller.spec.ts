import { Test, TestingModule } from '@nestjs/testing';
import { AtendeeController } from './atendee.controller';

describe('Atendee Controller', () => {
  let controller: AtendeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AtendeeController],
    }).compile();

    controller = module.get<AtendeeController>(AtendeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
