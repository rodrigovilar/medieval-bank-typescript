import { BurgosAgency } from './burgos-agency';

import { AtendeeService } from '../atendee/atendee/atendee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import {Atendee} from '../atendee/atendee.entity';
import { AgencyService } from './agency.service';
import { AgencyModule } from './agency.module';

describe('AgencyService', () => {
  let agencyService: AgencyService;

  const EXAMPLE_NAME: string = 'A';
  const EXAMPLE_EMAIL: string = 'a@a.com';
  const EXAMPLE_SSN: string = '623-76-7120';
  const UNKNOWN_ID = -1;

  function buildAtendee(name: string, email?:string, ssn?:string): Atendee {
    let atendee = new Atendee();
    atendee.name = name;
    atendee.ssn = ssn ? ssn : undefined;
    atendee.email = email ? email : undefined;

    return atendee;
  }

  async function addMultipleAttendees(attendeeList: Atendee[]): Promise<void>{
      for(let attendee of attendeeList){
          await agencyService.addAtendee(attendee);
      }
  }



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
    agencyService.setAtendeeService( await module.get(AtendeeService));
  });

  //afterAll(async () => await serviceHelper.deleteAll(atendeeService));

 // afterEach(async () => await serviceHelper.deleteAll(atendeeService));

  it('t018_AgencyStatuswithoneAtendee', function () {
    agencyService.setName('Burgosland');
    let result = agencyService.getName();
    expect(result).toBe('Burgosland');
  });
  
  it('t015_agencyStatusWithoutAtendee', async function () {
    const status: string = await agencyService.getStatus();

    const expectedResult = "Atendees: []\nQueue: []"
    expect(status).toBe(expectedResult);
  });

  it('t021_agencyStatusWithThreeAtendee', async function () {
    const status: string = await agencyService.getStatus();
    
    const attendee: Atendee = buildAtendee(EXAMPLE_NAME + "1");
    const attendee2: Atendee = buildAtendee(EXAMPLE_NAME +"2");
    const attendee3: Atendee = buildAtendee(EXAMPLE_NAME +"3");

    await addMultipleAttendees([attendee, attendee2, attendee3]);

    const expectedResult = "Atendees: [A1, A2, A3]\nQueue: []"
    expect(status).toBe(expectedResult);
  });

});