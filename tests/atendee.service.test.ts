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
        let createdAtendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, '', '');

        serviceHelper.validateAtendee(EXAMPLE_NAME, '', createdAtendee);

        let searchedAtendee: Atendee = service.getOne(createdAtendee.id);

        expect(createdAtendee).toEqual(searchedAtendee);

    });

    it('t02_createAtendeeWithoutName ', () => {
        let atendee = new Atendee();

        const failMessage: string = 'Test failed because the system accepted to create atendee without name';

        const expectedExceptionMessage: string = 'Name is mandatory';

        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);
    });

    it('t03_atendeeNameDuplicated', () => {

        // creating first atendee
        serviceHelper.createAtendee(service, EXAMPLE_NAME, '', '');

        // creating second atendee
        let atendee2 = new Atendee();

        atendee2.name = EXAMPLE_NAME; // The same name!

        const failMessage: string = 'Test failed because the system accepted to create atendee with duplicated name';

        const expectedExceptionMessage: string = "Atendee name cannot be duplicated";

        serviceHelper.tryCreateAtendeeWithError(service, atendee2, failMessage, expectedExceptionMessage);
    });

    it('t04_createAtendeeWithAutomaticFields', () => {


        // creating first atendee
        let atendee = new Atendee();
        atendee.name = EXAMPLE_NAME;
        atendee.id = 123;

        let failMessage = "Test failed because the system accepted to create atendee with id already set";
        let expectedExceptionMessage = "Atendee id cannot be set";

        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

        let atendee2 = new Atendee();
        atendee2.name = EXAMPLE_NAME;
        atendee2.setCreation(new Date());

        serviceHelper.tryCreateAtendeeWithError(service, atendee2, failMessage, expectedExceptionMessage);
    });

    it('t05_createAtendeeWithInvalidEmail', () => {

        let atendee = new Atendee();
        atendee.name = EXAMPLE_NAME;

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

        let createdAtendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, '');

        const otherName: string = 'Other Name';
        const otherEmail: string = 'other@email.com';

        createdAtendee.name = otherName;
        createdAtendee.email = otherEmail;

        let updatedAtendee: Atendee = service.update(createdAtendee);

        serviceHelper.validateAtendee(otherName, otherEmail, updatedAtendee);

        expect(createdAtendee.id).not.toBeNull();
        expect(createdAtendee.getCreation).not.toBeNull();

        let searchedAtendee: Atendee = service.getOne(updatedAtendee.id);
        expect(updatedAtendee).toEqual(searchedAtendee);

    });

    it('t07_updateAtendeeWithImmutableFields', () => {

        let createdAtendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);

        createdAtendee.ssn = '670-03-8924';

        const failMessage: string = 'Test failed because the system accepted to update atendee with a new SSN';
        const expectedExceptionMessage: string = 'Atendee SSN is immutable';

        serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

    });

    it('t08_updateAtendeeWithUnknownId', () => {

        let createdAtendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);

        createdAtendee.id = -1;
        createdAtendee.name = 'Meytal cohen';
        createdAtendee.email = 'meytal.cohen@gmail.com';

        const failMessage: string = 'Test failed because the system accepted to update atendee with unknown id';
        const expectedExceptionMessage: string = 'Atendee with unknown id';

        serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);
    });

    it('t09_updateAtendeeWithNullMandatoryFields', () => {

        let createdAtendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);

        createdAtendee.name = '';
        createdAtendee.email = '';
        createdAtendee.ssn = '';
        createdAtendee.date = undefined;

        const failMessage: string = 'Test failed because the system accepted to update atendee with null mandatory fields';
        const expectedExceptionMessage: string = 'Mandatory fields not entered'; // or Required fields not entered

        serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);
    });

    it('t10_updateAtendeeWithDuplicatedMandatoryFields', () => {

        let createdAtendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);

        createdAtendee.name = EXAMPLE_NAME;
        createdAtendee.email = EXAMPLE_EMAIL;
        createdAtendee.ssn = EXAMPLE_SSN;

        const failMessage: string = 'Test failed because the system accepted to update atendee with duplicated mandatory fields';
        const expectedExceptionMessage: string = 'Attendee name, email and ssn cannot be duplicated';

        serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);
    });

    it('t11_updateAtendeeWithAutomaticFields', () => {

        let createdAtendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);
        let creationDate = createdAtendee.date;

        // updating date
        createdAtendee.date = new Date("01/11/2019");

        createdAtendee.name = 'Meytal Cohen';
        createdAtendee.email = 'm@gmail.com';
        createdAtendee.ssn = '623-76-7120';

        let updatedAtendee = service.update(createdAtendee);

        expect(creationDate).toEqual(updatedAtendee.date);
    });

    it('t12_updateAtendeeWithInvalidEmail', () => {

        let atendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);

        const failMessage = "Test failed because the system accepted to update atendee with invalid e-mail format";
        const expectedExceptionMessage = "Atendee e-mail format is invalid";

        atendee.email = 'ssdd@.dd';
        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

        atendee.email = 'sdsdfa#gmail.com';
        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

        atendee.email = 'sdsdfa@gmail';
        serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    });


});
