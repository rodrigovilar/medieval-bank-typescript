import { AtendeeServiceHelper } from './atendee.service.test.helper';
import { AtendeeService } from "../src/atendee/atendee.service";
import { Atendee } from "../src/atendee/atendee";



describe('AtendeeServiceTest', () => {

    let service: AtendeeService;

    let serviceHelper: AtendeeServiceHelper;

    const EXAMPLE_NAME: string = 'A Name';

    const EXAMPLE_EMAIL: string = 'a@a.com';

    const EXAMPLE_SSN: string = '623-76-7120';

    // This function is called *before each test specification*, *it* function, has been run.
    beforeEach(() => {
        service = new AtendeeService();
    });

    it('t01_createAtendee', function () {

        // create object
        let createdAtendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, '');

        serviceHelper.validateAtendee(EXAMPLE_NAME, '', createdAtendee);

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
        const failMessage: string = 'Test failed because the system accepted to create atendee without name';
        const expectedExceptionMessage: string = "Name is mandatory";

        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);
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

        serviceHelper.tryCreateAtendeeWithError(service, atendee2, failMessage, expectedExceptionMessage);
    });

    it('t04_createAtendeeWithAutomaticFields', () => {
        const aName: string = 'Hermanoteu';

        // creating first atendee
        let atendee = new Atendee();
        atendee.name = aName;
        atendee.id = 123;

        let failMessage = "Test failed because the system accepted to create atendee with id already set";
        let expectedExceptionMessage = "Atendee id cannot be set";

        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

        let atendee2 = new Atendee();
        atendee2.name = aName;
        atendee2.setCreation(new Date());

        failMessage = "Test failed because the system accepted to create atendee with creation already set";
        expectedExceptionMessage = "Atendee creation cannot be set";

        serviceHelper.tryCreateAtendeeWithError(service, atendee2, failMessage, expectedExceptionMessage);
    });

    it('t05_createAtendeeWithInvalidEmail', () => {
        const aName: string = 'Hermanoteu';

        let atendee = new Atendee();
        atendee.name = aName;


        const failMessage = "Test failed because the system accepted to create atendee with invalid e-mail format";
        const expectedExceptionMessage = "Atendee e-mail format is invalid";

        atendee.email = 'ssdd@.dd';
        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

        atendee.email = 'sdsdfa#gmail.com';
        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

        atendee.email = 'sdsdfa@gmail';
        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);
    });

    it('t06_updateAtendee', () => {
    });
});
