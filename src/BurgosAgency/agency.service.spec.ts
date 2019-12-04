import { BurgosAgency } from './burgos-agency';

import { AtendeeServiceHelper } from '../atendee/atendee/atendee.service.helper';
import { AtendeeService } from '../atendee/atendee/atendee.service';
import {AtendeeModule} from '../atendee/atendee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import {Atendee} from '../atendee/atendee.entity';
import { AgencyService } from './agency.service';
import { AgencyModule } from './agency.module';

describe('AgencyService', () => {
  let agencyService: AgencyService;


  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AgencyModule,

        // database
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'burgosDB',
          entities: [Atendee],
          synchronize: true
        })]
    }).compile();
    agencyService = module.get(AgencyService);
  });

  //afterAll(async () => await serviceHelper.deleteAll(atendeeService));

 // afterEach(async () => await serviceHelper.deleteAll(atendeeService));

  it('t018_AgencyStatuswithoneAtendee', async function () {
    agencyService.setName('Burgosland');
    let result = agencyService.getName();
    expect(result).toBe('Burgosland');
  });
  
  it('t015_agencyStatusWithoutAtendee', function () {
    agencyService.setName('Burgosland');
    let result = agencyService.getName();
    expect(result).toBe('Burgosland');
  });

});