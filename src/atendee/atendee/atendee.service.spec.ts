import { AtendeeService } from './atendee.service';
import { AtendeeServiceHelper } from './atendee.service.helper';
import { Atendee } from '../atendee.entity';

import { Test } from '@nestjs/testing';
import { AtendeeModule } from '../atendee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandModule } from '../../demand/demand.module';
import { Demand } from '../../demand/demand.entity';

describe('AtendeeService', () => {
  let service: AtendeeService;

  let serviceHelper: AtendeeServiceHelper;

  const EXAMPLE_NAME: string = 'A Name';

  const EXAMPLE_EMAIL: string = 'a@a.com';

  const EXAMPLE_SSN: string = '623-76-7120';

  const UNKNOWN = -1;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AtendeeModule, DemandModule,
        // database
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'burgosDB',
          entities: [Atendee, Demand],
          synchronize: true,
        })],
    }).compile();
    service = module.get(AtendeeService);
    serviceHelper = new AtendeeServiceHelper();
  });

  afterAll(async () => await serviceHelper.deleteAll(service));
  afterEach(async () => await serviceHelper.deleteAll(service));

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  test('t01_createAtendee', async () => {
    const createdAtendee = await serviceHelper.createAtendee(service, null, 'Diego', null, EXAMPLE_EMAIL, null);
    const searchedAtendee = await service.getOne(createdAtendee.id);

    expect(createdAtendee).toEqual(searchedAtendee);
  });

  test('t02_createAtendeeWithoutName ', async () => {

    const atendee: Atendee = new Atendee();

    atendee.name = null;
    atendee.email = 'Elza';
    atendee.ssn = EXAMPLE_SSN;

    const failMessage: string = 'Test failed because the system accepted to create atendee without name';

    const expectedExceptionMessage: string = 'Name is mandatory';

    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

  });

  test('t03_atendeeNameDuplicated', async () => {

    // creating first atendee
    await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    // creating second atendee
    const atendee2 = new Atendee();

    atendee2.id = null;
    atendee2.name = EXAMPLE_NAME; // The same name!
    atendee2.email = EXAMPLE_EMAIL;
    atendee2.ssn = EXAMPLE_SSN;

    const failMessage: string = 'Test failed because the system accepted to create atendee with duplicated name';

    const expectedExceptionMessage: string = 'Atendee name cannot be duplicated';

    await serviceHelper.tryCreateAtendeeWithError(service, atendee2, failMessage, expectedExceptionMessage);
  });

  test('t04_createAtendeeWithAutomaticFields', async () => {

    // creating first atendee
    const createdAtendee = await serviceHelper.createAtendee(service, null, 'Fernando', null, 'a@abc.com', EXAMPLE_SSN);
    const atendee = new Atendee();
    atendee.name = 'Lucio';
    atendee.date = null;
    atendee.email = 'a@abc.com';
    atendee.id = createdAtendee.id;

    const failMessage = 'Test failed because the system accepted to create atendee with id already set';
    const expectedExceptionMessage = 'Atendee id cannot be set';

    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    const failMessage2 = 'Test failed because the system accepted to create atendee with date null';
    const expectedExceptionMessage2 = 'Atendee date cannot be set';

    const atendee2 = new Atendee();
    atendee2.name = 'Aline';
    atendee2.email = 'a@cde.com';
    atendee2.date = new Date();

    await serviceHelper.tryCreateAtendeeWithError(service, atendee2, failMessage2, expectedExceptionMessage2);
  });

  test('t05_createAtendeeWithInvalidEmail', async () => {

    const atendee = new Atendee();
    atendee.name = 'Zé do Berrante';

    const failMessage = 'Test failed because the system accepted to create atendee with invalid e-mail format';
    const expectedExceptionMessage = 'Atendee e-mail format is invalid';

    atendee.email = 'ssdd@.dd';
    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    atendee.email = 'sdsdfa#gmail.com';
    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    atendee.email = 'sdsdfa@gmail';
    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);
  });

  test('t06_updateAtendee', async () => {

    const createdAtendee = await serviceHelper.createAtendee(service, null, 'Rogério', null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    // updating fields
    const otherEmail: string = 'other@email.com';

    createdAtendee.email = otherEmail;

    const updatedAtendee = await service.update(createdAtendee);

    serviceHelper.validateAtendee('Rogério', otherEmail, updatedAtendee);

    expect(updatedAtendee.date).toEqual(createdAtendee.date);

    // check in database
    const searchedAtendee: Atendee = await service.getOne(updatedAtendee.id);
    expect(updatedAtendee).toEqual(searchedAtendee);

  });

  test('t07_updateAtendeeWithImmutableFields', async () => {

    const createdAtendee = await serviceHelper.createAtendee(service, null, 'Miguel', null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    createdAtendee.ssn = '670-03-8924';

    const failMessage: string = 'Test failed because the system accepted to update atendee with a new SSN';
    const expectedExceptionMessage: string = 'Atendee SSN is immutable';

    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

  });

  test('t08_updateAtendeeWithUnknownId', async () => {

    const atendeeUnknownId: Atendee = new Atendee();
    atendeeUnknownId.id = UNKNOWN;
    atendeeUnknownId.name = 'Davi';

    let failMessage: string = 'Test failed because the system accepted to update atendee with unknown id';
    let expectedExceptionMessage: string = `Atendee id not found: ${UNKNOWN}`;

    await serviceHelper.tryUpdateAtendeeWithError(service, atendeeUnknownId, failMessage, expectedExceptionMessage);

    const createdAtendee: Atendee = await serviceHelper.createAtendee(service, null, 'Alice', null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    createdAtendee.id = UNKNOWN;
    createdAtendee.name = 'Arthur';
    createdAtendee.email = 'meytal.cohen@gmail.com';

    failMessage = 'Test failed because the system accepted to update atendee with unknown id';
    expectedExceptionMessage = `Atendee id not found: ${UNKNOWN}`;

    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);
  });

  test('t09_updateAtendeeWithoutName', async () => {

    const createdAtendee: Atendee = await serviceHelper.createAtendee(service, null, 'Pedro', null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    createdAtendee.name = '';
    createdAtendee.email = '';
    createdAtendee.ssn = '';
    createdAtendee.date = undefined;

    const failMessage: string = 'Test failed because the system accepted to update atendee with null mandatory fields';
    const expectedExceptionMessage: string = 'Name is mandatory'; // or Required fields not entered

    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

    createdAtendee.name = null;
    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

    createdAtendee.name = undefined;
    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

  });

  test('t10_updateAtendeeWithDuplicatedName', async () => {

    await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);
    const createdAtendee: Atendee = await serviceHelper.createAtendee(service, null, 'Meytal cohen', null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    createdAtendee.name = EXAMPLE_NAME;

    const failMessage: string = 'Test failed because the system accepted to update atendee with duplicated mandatory fields';
    const expectedExceptionMessage: string = 'Atendee name cannot be duplicated';

    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

  });

  test('t11_updateAtendeeWithAutomaticFields', async () => {

    const createdAtendee: Atendee = await serviceHelper.createAtendee(service, null, 'Matheus', null, EXAMPLE_EMAIL, EXAMPLE_SSN);
    const creationDate = createdAtendee.date;

    // tslint:disable-next-line:no-empty
    // setInterval(async () => { }, 1);
    createdAtendee.date = new Date();

    createdAtendee.name = 'Meytal Cohen';
    createdAtendee.email = 'm@gmail.com';
    createdAtendee.ssn = '623-76-7120';

    const failMessage = 'Test failed because the system accepted to update atendee with changed creation';
    const expectedExceptionMessage = 'Atendee creation date cannot be changed';
    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

    const updatedAtendee = await service.getOne(createdAtendee.id);

    expect(creationDate).toEqual(updatedAtendee.date);
  });

  test('t12_updateAtendeeWithInvalidEmail', async () => {

    const atendee: Atendee = await serviceHelper.createAtendee(service, null, 'Heitor', null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    const failMessage = 'Test failed because the system accepted to update atendee with invalid e-mail format';
    const expectedExceptionMessage = 'Atendee e-mail format is invalid';

    atendee.email = 'ssdd@.dd';
    await serviceHelper.tryUpdateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    atendee.email = 'sdsdfa#gmail.com';
    await serviceHelper.tryUpdateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    atendee.email = 'sdsdfa@gmail';
    await serviceHelper.tryUpdateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

  });

  test('t13_deleteAtendee', async () => {

    const atendee: Atendee = await serviceHelper.createAtendee(service, null, 'Enzo', null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    await service.delete(atendee.id);

    const searchedAtendee = await service.getOne(atendee.id);
    expect(searchedAtendee).toBeUndefined();

  });

  test('t14_deleteAtendeeThatDoesNotExist', async () => {
    const atendee = new Atendee();
    atendee.id = 123;
    atendee.name = 'José';
    atendee.email = EXAMPLE_EMAIL;
    atendee.ssn = EXAMPLE_SSN;

    const searchedAtendee = await service.getOne(atendee.id);
    expect(searchedAtendee).toBeUndefined();

    const failMessage = 'Test failed because the system accepted to delete a null atendee';
    const expectedExceptionMessage = `Atendee not found id: ${atendee.id}`;

    await serviceHelper.tryDeleteAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

  });

  test('t15_getAllAtendee', async () => {

    const atendee1 = await serviceHelper.createAtendee(service, null, 'EXAMPLE_NAME', null, EXAMPLE_EMAIL, EXAMPLE_SSN);
    const atendee2 = await serviceHelper.createAtendee(service, null, 'Meytal Cohen', null, 'meytalcohen@gmail.com', '123-76-7120');
    const atendee3 = await serviceHelper.createAtendee(service, null, 'Bio Gates', null, 'bil.gates@hotmail.com', '623-76-2255');

    const atendeeList = await service.findAll();

    expect(atendeeList.length).toEqual(3);
    expect(atendee1).toEqual(atendeeList[0]);
    expect(atendee2).toEqual(atendeeList[1]);
    expect(atendee3).toEqual(atendeeList[2]);

    // eliminate a warning in try-catch console
    await service.getOne(atendee1.id);
  });

  it('t16_filterByField', async () => {

    const atendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);
    const atendeeMeytal = await serviceHelper.createAtendee(service, null, 'Meytal Gates', null, 'meytalgates@gmail.com', '123-83-7120');
    const atendeeBill = await serviceHelper.createAtendee(service, null, 'Bill Gates', null, 'bill.gates@hotmail.com', '623-83-2255');

    let field: string = 'name';
    let equalTo: string = 'marrone';
    let filteredList: Atendee[] = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(0);

    // names
    field = 'name';
    equalTo = 'gates';
    filteredList = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(2);

    equalTo = 'b';
    filteredList = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(1);

    equalTo = '4';
    filteredList = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(0);
    // and name

    // ssn
    field = 'ssn';
    equalTo = '83';
    filteredList = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(2);

    equalTo = '3';
    filteredList = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(3);

    // field = 'ssn';
    equalTo = '4';
    filteredList = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(0);
    // end ssn

    // email
    field = 'email';
    equalTo = 'gmail';
    filteredList = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(1);

    // field = 'email';
    equalTo = 'hotmail';
    filteredList = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(1);

    // field = 'email';
    equalTo = 'outlook';
    filteredList = await service.filterByField(field, equalTo);
    expect(filteredList.length).toEqual(0);
    // end email
  });

});
