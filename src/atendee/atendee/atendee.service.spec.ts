import { Test, TestingModule } from '@nestjs/testing';
import { AtendeeService } from './atendee.service';
import { async } from 'rxjs/internal/scheduler/async';

describe('AtendeeService', () => {
  let service: AtendeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AtendeeService],
    }).compile();

    service = module.get<AtendeeService>(AtendeeService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  // it('', () => {

  //   let atendee = new Atendee();
  //   atendee.name = "Meytal"
  //   atendee.email = "m@gmail.com"
  //   atendee.ssn = "ss11";
  //   atendee.date = new Date();

  //   let createdAtendee: Promise<Atendee> = service.create(atendee);

  //   expect(createdAtendee).toEqual(atendee);


  //   // expect()

  // });

});
