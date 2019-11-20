import { AtendeeController } from './atendee.controller';
import { AtendeeService } from './atendee.service';

describe('Atendee Controller', () => {
  let controller: AtendeeController;
  let service: AtendeeService;

  beforeEach(async () => {
    controller = new AtendeeController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
