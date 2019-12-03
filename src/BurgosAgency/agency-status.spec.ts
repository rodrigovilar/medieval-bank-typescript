import { BurgosAgency } from './burgos-agency';

import { AtendeeServiceHelper } from '../atendee/atendee/atendee.service.helper';
import { AtendeeService } from '../atendee/atendee/atendee.service';
import {AtendeeModule} from '../atendee/atendee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import {Atendee} from '../atendee/atendee.entity';

describe('BurgosAgency', () => {
  let service: AtendeeService;

  let serviceHelper: AtendeeServiceHelper;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AtendeeModule,

        // database
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'burgosDB',
          entities: [Atendee],
          synchronize: true
        })]
    }).compile();
    service = module.get(AtendeeService);
    serviceHelper = new AtendeeServiceHelper();
  });

  afterAll(async () => await serviceHelper.deleteAll(service));

  afterEach(async () => await serviceHelper.deleteAll(service));

  it('t018_AgencyStatuswithoneAtendee', function () {
    BurgosAgency.SetName('Burgosland');
    let result = BurgosAgency.GetName();
    expect(result).toBe('Burgosland');
  });
  


  it('t015_agencyStatusWithoutAtendee', function () {
    BurgosAgency.SetName('Burgosland');
    let result = BurgosAgency.GetName();
    expect(result).toBe('Burgosland');
  });

});

