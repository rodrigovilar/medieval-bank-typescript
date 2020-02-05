import {AtendeeService} from '../atendee/atendee/atendee.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Test} from '@nestjs/testing';
import {Atendee} from '../atendee/atendee.entity';
import {AgencyService} from './agency.service';
import {AgencyModule} from './agency.module';
import {Demand} from '../demand/demand.entity';
import {DemandService} from '../demand/demand.service';

describe('AgencyServiceTest', () => {
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

    afterEach(async () => {
        await agencyService.getAtendeeService().deleteAll();
        await agencyService.getDemandService().deleteAll();
        agencyService.setTick(0);
    });

    beforeEach(async () => {
        await agencyService.getAtendeeService().deleteAll();
        await agencyService.getDemandService().deleteAll();
        agencyService.setTick(0);
    });

    it('t018_AgencyStatuswithoneAttendee', async () => {
      const attendee: Atendee = buildAtendee(ATTENDEE_EX_NAME + '1');
      await addMultipleAttendees([attendee]);
      const status: string = await agencyService.getStatus();

      const expectedResult = 'Atendees: [A1]\nQueue: []';
      expect(status).toBe(expectedResult);
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

    it('t024_AgencyStatusAfterRemovingAnAtendee', async () => {
        const attendee: Atendee = buildAtendee(ATTENDEE_EX_NAME + '1');
        const attendee2: Atendee = buildAtendee(ATTENDEE_EX_NAME + '2');
        const attendee3: Atendee = buildAtendee(ATTENDEE_EX_NAME + '3');

        await addMultipleAttendees([attendee, attendee2, attendee3]);

        await agencyService.deleteAtendee(attendee2);

        const status: string = await agencyService.getStatus();
        const expectedResult = 'Atendees: [A1,A3]\nQueue: []';
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

    it('t030_agencyStatusWithTick', async () => {
        const status: string = await agencyService.getStatus();
        const expectedResult = 'Atendees: []\nQueue: []';
        expect(status).toBe(expectedResult);
        expect(agencyService.getTick()).toBe(0);

        await agencyService.increaseTick();
        expect(agencyService.getTick()).toBe(1);

        await agencyService.increaseTick();
        expect(agencyService.getTick()).toBe(2);
    });

    it('t033_agencyStatusWithTickAndDemand', async () => {
        const d1: Demand = buildDemand(DEMAND_EX_NAME + '1');
        const d2: Demand = buildDemand(DEMAND_EX_NAME + '2');
        const d3: Demand = buildDemand(DEMAND_EX_NAME + '3');

        await addMultipleDemand([d1, d2, d3]);

        const expectedResult = 'Atendees: []\nQueue: [D1,D2,D3]';

        let status: string = await agencyService.getStatus();
        expect(status).toBe(expectedResult);
        expect(agencyService.getTick()).toBe(0);

        await agencyService.increaseTick();
        status = await agencyService.getStatus();
        expect(status).toBe(expectedResult);
        expect(agencyService.getTick()).toBe(1);
    });

    it('t036_agencyStatusWithTickQueueAndAttendee', async () => {
        const d1: Demand = buildDemand(DEMAND_EX_NAME + '1');
        const a1: Atendee = buildAtendee(ATTENDEE_EX_NAME + '1');
        a1.email = 'a@mail.com';

        await addMultipleAttendees([a1]);
        await addMultipleDemand([d1]);

        let expectedResult = 'Atendees: [A1]\nQueue: [D1]';
        let status = await agencyService.getStatus();
        expect(status).toBe(expectedResult);
        expect(agencyService.getTick()).toBe(0);

        await agencyService.increaseTick();

        expectedResult = 'Atendees: [A1->D1]\nQueue: []';
        status = await agencyService.getStatus();
        expect(status).toBe(expectedResult);
        expect(agencyService.getTick()).toBe(1);
    });

});
