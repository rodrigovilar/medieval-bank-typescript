import { AtendeeServiceHelper } from './atendee.service.test.helper';
import { AtendeeService } from "../src/atendee/atendee.service";
import { Atendee } from "../src/atendee/atendee";



describe('AtendeeServiceTest', () => {

    let service: AtendeeService;

    let serviceHelper: AtendeeServiceHelper;

    const EXAMPLE_NAME: string = 'A Name';

    const EXAMPLE_EMAIL: string = 'a@a.com';

    const EXAMPLE_SSN: string = '623-76-7120';

    const UNKNOWN = -1;

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

        let atendeeUnknownId: Atendee = new Atendee();
        atendeeUnknownId.id = UNKNOWN;

        let failMessage: string = 'Test failed because the system accepted to update atendee with unknown id';
        let expectedExceptionMessage: string = `Atendee id not found: ${UNKNOWN}`;

        serviceHelper.tryUpdateAtendeeWithError(service, atendeeUnknownId, failMessage, expectedExceptionMessage);

        let createdAtendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);

        createdAtendee.id = UNKNOWN;
        createdAtendee.name = 'Meytal cohen';
        createdAtendee.email = 'meytal.cohen@gmail.com';

        failMessage = 'Test failed because the system accepted to update atendee with unknown id';
        expectedExceptionMessage = `Atendee id not found: ${UNKNOWN}`;

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

    it('t13_deleteAtendee', () => {

        let atendee: Atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);
        let deleteAtendee: Atendee = service.delete(atendee);

        expect(deleteAtendee).toEqual(atendee);

        const expectedExceptionMessage = 'Atendee not found';
        const failMessage = "The test failed because the system returned the attendant when it should not have found";
        try {
            service.getOne(atendee.id);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }
    });

    it("t14_deleteAtendeeThatDoesNotExist", () => {

        let atendee = new Atendee();
        atendee.id = 123;
        atendee.name = EXAMPLE_NAME;
        atendee.email = EXAMPLE_EMAIL;
        atendee.ssn = EXAMPLE_SSN;

        const expectedExceptionMessage = 'Atendee does not exist';
        const failMessage = "Test failed because system 'deleted' an attendant that does not exist";

        serviceHelper.tryDeleteAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);
    });

    it("t15_getAllAtendee", () => {

        let atendee1 = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);
        let atendee2 = serviceHelper.createAtendee(service, 'Meytal Cohen', 'meytalcohen@gmail.com', '123-76-7120');
        let atendee3 = serviceHelper.createAtendee(service, 'Bio Gates', 'bil.gates@hotmail.com', '623-76-2255');

        let atendeeList: Atendee[] = service.getAll();

        expect(atendeeList.length).toEqual(3);
        expect(atendeeList[0]).toEqual(atendee1);
        expect(atendeeList[1]).toEqual(atendee2);
        expect(atendeeList[2]).toEqual(atendee3);
    });

    it('t16_filterByField', () => {

        let atendee = serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);
        let atendeeMeytal = serviceHelper.createAtendee(service, 'Meytal Gates', 'meytalgates@gmail.com', '123-83-7120');
        let atendeeBill = serviceHelper.createAtendee(service, 'Bill Gates', 'bill.gates@hotmail.com', '623-83-2255');

        let field: string = 'name';
        let equalTo: string = 'marrone';
        let filteredList: Atendee[] = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(0);


        // names
        field = 'name';
        equalTo = 'gates';
        filteredList = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(2);
        expect(filteredList[0]).toEqual(atendeeMeytal);
        expect(filteredList[1]).toEqual(atendeeBill);

        field = 'name';
        equalTo = 'b';
        filteredList = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(1);
        expect(filteredList[0]).toEqual(atendeeBill);

        field = 'name';
        equalTo = '4';
        filteredList = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(0);
        // and name

        // ssn
        field = 'ssn';
        equalTo = '83';
        filteredList = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(2);
        expect(filteredList[0]).toEqual(atendeeMeytal);
        expect(filteredList[1]).toEqual(atendeeBill);

        field = 'ssn';
        equalTo = '3';
        filteredList = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(3);
        expect(filteredList[0]).toEqual(atendee);
        expect(filteredList[1]).toEqual(atendeeMeytal);
        expect(filteredList[2]).toEqual(atendeeBill);

        field = 'ssn';
        equalTo = '4';
        filteredList = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(0);
        // end ssn

        // email 
        field = 'email';
        equalTo = 'gmail';
        filteredList = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(2);
        expect(filteredList[0]).toEqual(atendee);
        expect(filteredList[1]).toEqual(atendeeMeytal);

        field = 'email';
        equalTo = 'hotmail';
        filteredList = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(1);
        expect(filteredList[0]).toEqual(atendeeBill);

        field = 'email';
        equalTo = 'outlook';
        filteredList = service.filterByField(field, equalTo);
        expect(filteredList.length).toEqual(0);
        // end email
    });

});
