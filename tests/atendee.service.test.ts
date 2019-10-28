import { AtendeeService } from "../src/atendee/atendee.service";
import { Atendee } from "../src/atendee/atendee";

describe('AtendeeServiceTest', () => {

    let service: AtendeeService;

    // This function is called *before each test specification*, *it* function, has been run.
    beforeEach(() => {
        service = new AtendeeService();
    });

    it('validateAtendee', function () {
        let atendee: Atendee = new Atendee();
        expect(atendee.id).not.toEqual(0);
        expect(atendee.getCreation()).not.toBeUndefined;
        expect(atendee.name).not.toEqual('');
    })

    it('t01_createAtendee', function () {

        // create object
        let atendee = new Atendee();
        atendee.name = 'A name';

        const createdAtendee = service.create(atendee);

        expect(createdAtendee.id).not.toBeUndefined;
        expect(createdAtendee.date).not.toBeUndefined;

        const searchedAtendee = service.getOne(createdAtendee.id);

        expect(createdAtendee).toEqual(searchedAtendee);

    });
    it('t02_createAtendeeWithoutName ', () => {
        let atendee = new Atendee();

        try {
            service.create(atendee);
            fail('Accepted atendee without name');
        } catch (ex) {
            expect('Name is mandatory').toEqual(ex.message);
        }
    });

    it('t03_atendeeNameDuplicated', () => {

        const aName: string = 'Hermanoteu';

        // creating first atendee
        let atendee1 = new Atendee();
        atendee1.name = aName;

        // creating second atendee
        let atendee2 = new Atendee();
        atendee2.name = aName; // The same name!

        service.create(atendee1);
        const failMessage: string = 'Test failed because the system accepted to create atendee with duplicated name';
        const expectedExceptionMessage: string = "Atendee name cannot be duplicated";

        try {
            service.create(atendee2);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }
    });

    it('t04_createAtendeeWithAutomaticFields', () => {
        const aName: string = 'Hermanoteu';

        // creating first atendee
        let atendee = new Atendee();
        atendee.name = aName;
        atendee.id = 123;

        let failMessage = "Test failed because the system accepted to create atendee with id already set";
        let expectedExceptionMessage = "Atendee id cannot be set";

        try {
            service.create(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }

        let atendee2 = new Atendee();
        atendee2.name = aName;
        atendee2.setCreation(new Date());

        failMessage = "Test failed because the system accepted to create atendee with creation already set";
        expectedExceptionMessage = "Atendee creation cannot be set";


        try {
            service.create(atendee2);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }

    });

});