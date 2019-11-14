import { Test, TestingModule } from '@nestjs/testing';
import { AtendeeController } from './atendee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Atendee } from '../atendee.entity';

describe('Atendee Controller', () => {
  let controller: AtendeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Atendee])],
      controllers: [AtendeeController],
    }).compile();

    controller = module.get<AtendeeController>(AtendeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
