import {AtendeeService} from '../atendee/atendee/atendee.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Test} from '@nestjs/testing';
import {Atendee} from '../atendee/atendee.entity';
import {AgencyService} from './agency.service';
import {AgencyModule} from './agency.module';
import {Demand} from '../demand/demand.entity';
import {DemandService} from '../demand/demand.service';

describe('AgencyService', () => {
    let agencyService: AgencyService;

    const ATTENDEE_EX_NAME: string = 'A';
    const DEMAND_EX_NAME: string = 'D';
    const EXAMPLE_EMAIL: string = 'a@a.com';
    const EXAMPLE_SSN: string = '623-76-7120';
    const UNKNOWN_ID = -1;

    function buildAtendee(name: string): Atendee {
        const atendee = new Atendee();
        atendee.name = name;

        return atendee;
    }

    function buildDemand(name: string): Demand {
        const demand = new Demand();
        demand.name = name;
        return demand;
    }

    async function addMultipleAttendees(attendeeList: Atendee[]): Promise<void> {
        for (const attendee of attendeeList) {
            await agencyService.addAtendee(attendee);
        }
    }

    async function addMultipleDemand(demandList: Demand[]): Promise<void> {
        for (const demand of demandList) {
            await agencyService.addDemand(demand);
        }
    }

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AgencyModule,

                // database
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'burgosDB',
                    entities: [Atendee, Demand],
                    synchronize: true,
                })],
        }).compile();
        agencyService = module.get(AgencyService);
        agencyService.setAtendeeService(await module.get(AtendeeService));
        agencyService.setDemandService(await module.get(DemandService));
    });

    // afterAll(async () => await serviceHelper.deleteAll(atendeeService));

    afterEach(async () => {
        const attList: any = await agencyService.getAtendeeService().findAll();
        for (const att of attList) {
            await agencyService.getAtendeeService().delete(att.id);
        }
    });

    it('t018_AgencyStatuswithoneAtendee', function() {
        agencyService.setName('Burgosland');
        let result = agencyService.getName();
        expect(result).toBe('Burgosland');
    });

    it('t015_agencyStatusWithoutAttendee', async () => {
        const status: string = await agencyService.getStatus();

        const expectedResult = 'Atendees: []\nQueue: []';
        expect(status).toBe(expectedResult);
    });

    it('t021_agencyStatusWithThreeAttendee', async () => {
        const attendee: Atendee = buildAtendee(ATTENDEE_EX_NAME + '1');
        const attendee2: Atendee = buildAtendee(ATTENDEE_EX_NAME + '2');
        const attendee3: Atendee = buildAtendee(ATTENDEE_EX_NAME + '3');

        await addMultipleAttendees([attendee, attendee2, attendee3]);

        const status: string = await agencyService.getStatus();
        const expectedResult = 'Atendees: [A1,A2,A3]\nQueue: []';
        expect(status).toBe(expectedResult);
    });

    it('t027_agencyStatusWithOneDemand', async () => {
        const attendee: Atendee = buildAtendee(ATTENDEE_EX_NAME + '1');
        const demand: Demand = buildDemand(DEMAND_EX_NAME + '1');

        await addMultipleAttendees([attendee]);
        await addMultipleDemand([demand]);

        const status: string = await agencyService.getStatus();
        const expectedResult = 'Atendees: [A1]\nQueue: [D1]';
        expect(status).toBe(expectedResult);
    });

});
