import {AtendeeService} from '../atendee/atendee/atendee.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Test} from '@nestjs/testing';
import {Atendee} from '../atendee/atendee.entity';
import {AgencyService} from './agency.service';
import {AgencyModule} from './agency.module';

describe('AgencyService', () => {
    let agencyService: AgencyService;

    const EXAMPLE_NAME: string = 'A';
    const EXAMPLE_EMAIL: string = 'a@a.com';
    const EXAMPLE_SSN: string = '623-76-7120';
    const UNKNOWN_ID = -1;

    function buildAtendee(name: string): Atendee {
        const atendee = new Atendee();
        atendee.name = name;

        return atendee;
    }

    async function addMultipleAttendees(attendeeList: Atendee[]): Promise<void> {
        for (const attendee of attendeeList) {
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
                    synchronize: true,
                })],
        }).compile();
        agencyService = module.get(AgencyService);
        agencyService.setAtendeeService(await module.get(AtendeeService));
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
        const attendee: Atendee = buildAtendee(EXAMPLE_NAME + '1');
        const attendee2: Atendee = buildAtendee(EXAMPLE_NAME + '2');
        const attendee3: Atendee = buildAtendee(EXAMPLE_NAME + '3');

        await addMultipleAttendees([attendee, attendee2, attendee3]);

        const status: string = await agencyService.getStatus();
        const expectedResult = 'Atendees: [A1,A2,A3]\nQueue: []';
        expect(status).toBe(expectedResult);
    });

    it('t024_AgencyStatusAfterRemovingAnAtendee', async () => {
        const attendee: Atendee = buildAtendee(EXAMPLE_NAME + '1');
        const attendee2: Atendee = buildAtendee(EXAMPLE_NAME + '2');
        const attendee3: Atendee = buildAtendee(EXAMPLE_NAME + '3');

        await addMultipleAttendees([attendee, attendee2, attendee3]);

        await agencyService.deleteAtendee(attendee2);

        const status: string = await agencyService.getStatus();
        const expectedResult = 'Atendees: [A1,A3]\nQueue: []';
        expect(status).toBe(expectedResult);
    });

});
