import { AtendeeService } from './atendee.service';
import { AtendeeServiceHelper } from './atendee.service.helper';
import { INestApplication } from '@nestjs/common';
import { Atendee } from '../atendee.entity';

import { Test } from '@nestjs/testing';
import { AtendeeModule } from '../atendee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { async } from 'rxjs/internal/scheduler/async';

describe('AtendeeService', () => {
  let service: AtendeeService;

  let serviceHelper: AtendeeServiceHelper;

  const EXAMPLE_NAME: string = 'A Name';

  const EXAMPLE_EMAIL: string = 'a@a.com';

  const EXAMPLE_SSN: string = '623-76-7120';

  const UNKNOWN = -1;

  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AtendeeModule,

        // database
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'burgosDB',
          entities: [Atendee],
          synchronize: true
        })]
    }).compile();
    service = module.get(AtendeeService);
    serviceHelper = new AtendeeServiceHelper();
  });

  afterAll(async () => await serviceHelper.deleteAll(service));

  afterEach(async () => await serviceHelper.deleteAll(service));


  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  // --------------- INICIO RUAN
  // test('t01_createAtendee', async () => {
  //   let createdAtendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, null);
  //   let searchedAtendee = await service.getOne(createdAtendee.id)

  //   expect(createdAtendee).toEqual(searchedAtendee);
  // });

  test('t02_createAtendeeWithoutName ', async () => {

    let atendee: Atendee = new Atendee();

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
    let atendee2 = new Atendee();

    atendee2.name = EXAMPLE_NAME; // The same name!
    atendee2.email = EXAMPLE_EMAIL;
    atendee2.ssn = EXAMPLE_SSN;

    const failMessage: string = 'Test failed because the system accepted to create atendee with duplicated name';

    const expectedExceptionMessage: string = "Atendee name cannot be duplicated";



    // try {
    //   await service.create(atendee2);
    //   console.log('Deu error')
    //   fail(failMessage);
    // } catch (error) {
    //   expect(error.message).toEqual(expectedExceptionMessage);
    // }


    let atendee = await serviceHelper.tryCreateAtendeeWithError(service, atendee2, failMessage, expectedExceptionMessage);
  });

  test('t04_createAtendeeWithAutomaticFields', async () => {

    // creating first atendee
    let createdAtendee = await serviceHelper.createAtendee(service, null, 'Fernando', null, 'a@abc.com', EXAMPLE_SSN);
    let atendee = new Atendee();
    atendee.name = 'Lucio';
    atendee.date = null;
    atendee.email = 'a@abc.com';
    atendee.id = createdAtendee.id;

    let failMessage = "Test failed because the system accepted to create atendee with id already set";
    let expectedExceptionMessage = "Atendee id cannot be set";

    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    let failMessage2 = "Test failed because the system accepted to create atendee with date null";
    let expectedExceptionMessage2 = "Atendee date cannot be set";

    let atendee2 = new Atendee();
    atendee2.name = 'Aline';
    atendee2.email = 'a@cde.com';
    atendee2.date = new Date();

    await serviceHelper.tryCreateAtendeeWithError(service, atendee2, failMessage2, expectedExceptionMessage2);
  });

  test('t05_createAtendeeWithInvalidEmail', async () => {

    let atendee = new Atendee();
    atendee.name = EXAMPLE_NAME;

    const failMessage = "Test failed because the system accepted to create atendee with invalid e-mail format";
    const expectedExceptionMessage = "Atendee e-mail format is invalid";

    atendee.email = 'ssdd@.dd';
    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    atendee.email = 'sdsdfa#gmail.com';
    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    atendee.email = 'sdsdfa@gmail';
    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);
  });
  // --------------- FINAL  RUAN


  test('t06_updateAtendee', async () => {

    let createdAtendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    // updating fields
    const otherEmail: string = 'other@email.com';

    createdAtendee.email = otherEmail;

    let updatedAtendee = await service.update(createdAtendee);

    serviceHelper.validateAtendee(EXAMPLE_NAME, otherEmail, updatedAtendee);

    expect(updatedAtendee.date).toEqual(createdAtendee.date);

    // check in database
    let searchedAtendee: Atendee = await service.getOne(updatedAtendee.id);
    expect(updatedAtendee).toEqual(searchedAtendee);

  });

  test('t07_updateAtendeeWithImmutableFields', async () => {

    let createdAtendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    createdAtendee.ssn = '670-03-8924';

    const failMessage: string = 'Test failed because the system accepted to update atendee with a new SSN';
    const expectedExceptionMessage: string = 'Atendee SSN is immutable';

    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

  });


  test('t08_updateAtendeeWithUnknownId', async () => {

    let atendeeUnknownId: Atendee = new Atendee();
    atendeeUnknownId.id = UNKNOWN;
    atendeeUnknownId.name = EXAMPLE_NAME;

    let failMessage: string = 'Test failed because the system accepted to update atendee with unknown id';
    let expectedExceptionMessage: string = `Atendee id not found: ${UNKNOWN}`;

    await serviceHelper.tryUpdateAtendeeWithError(service, atendeeUnknownId, failMessage, expectedExceptionMessage);

    let createdAtendee: Atendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    createdAtendee.id = UNKNOWN;
    createdAtendee.name = 'Meytal cohen';
    createdAtendee.email = 'meytal.cohen@gmail.com';

    failMessage = 'Test failed because the system accepted to update atendee with unknown id';
    expectedExceptionMessage = `Atendee id not found: ${UNKNOWN}`;

    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);
  });

  test('t09_updateAtendeeWithoutName', async () => {

    let createdAtendee: Atendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);

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
    let createdAtendee: Atendee = await serviceHelper.createAtendee(service, null, 'Meytal cohen', null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    createdAtendee.name = EXAMPLE_NAME;

    const failMessage: string = 'Test failed because the system accepted to update atendee with duplicated mandatory fields';
    const expectedExceptionMessage: string = 'Atendee name cannot be duplicated';

    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

  });

  test('t11_updateAtendeeWithAutomaticFields', async () => {

    let createdAtendee: Atendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);
    let creationDate = createdAtendee.date;

    setInterval(async () => { }, 1000)
    createdAtendee.date = new Date();

    createdAtendee.name = "Meytal Cohen";
    createdAtendee.email = 'm@gmail.com';
    createdAtendee.ssn = '623-76-7120';

    const failMessage = "Test failed because the system accepted to update atendee with changed creation";
    const expectedExceptionMessage = "Atendee creation date cannot be changed";
    await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);

    let updatedAtendee = await service.getOne(createdAtendee.id);

    expect(creationDate).toEqual(updatedAtendee.date);
  });

  test('t12_updateAtendeeWithInvalidEmail', async () => {

    let atendee: Atendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    const failMessage = "Test failed because the system accepted to update atendee with invalid e-mail format";
    const expectedExceptionMessage = "Atendee e-mail format is invalid";

    atendee.email = 'ssdd@.dd';
    await serviceHelper.tryUpdateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    atendee.email = 'sdsdfa#gmail.com';
    await serviceHelper.tryUpdateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    atendee.email = 'sdsdfa@gmail';
    await serviceHelper.tryUpdateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

  });

  test('t13_deleteAtendee', async () => {

    let atendee: Atendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    await service.delete(atendee.id);

    let searchedAtendee = await service.getOne(atendee.id);
    expect(searchedAtendee).toBeUndefined();

  });


  test("t14_deleteAtendeeThatDoesNotExist", async () => {
    let atendee = new Atendee();
    atendee.id = 123;
    atendee.name = 'José';
    atendee.email = EXAMPLE_EMAIL;
    atendee.ssn = EXAMPLE_SSN;

    let searchedAtendee = await service.getOne(atendee.id)
    expect(searchedAtendee).toBeUndefined();

    const failMessage = "Test failed because the system accepted to delete a null atendee";
    const expectedExceptionMessage = `Atendee not found id: ${atendee.id}`;

    await serviceHelper.tryDeleteAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

    // let atendeeMeytal: Atendee = await serviceHelper.createAtendee(service, null, 'Meytal cohen', null, 'meytal@gmail.com', EXAMPLE_SSN);
    // let atendeeBio: Atendee = await serviceHelper.createAtendee(service, null, 'Bio Gates', null, 'bio@gmail.com', EXAMPLE_SSN);
    // let atendeeSpider: Atendee = await serviceHelper.createAtendee(service, null, 'Spider Man', null, 'spider@gmail.com', EXAMPLE_SSN);

    // //
    // searchedAtendee = await service.getOne(atendeeMeytal.id)
    // serviceHelper.compareAtendees(atendeeMeytal, searchedAtendee);

    // //
    // searchedAtendee = await service.getOne(atendeeBio.id)
    // serviceHelper.compareAtendees(atendeeBio, searchedAtendee);

    // //
    // searchedAtendee = await service.getOne(atendeeSpider.id)
    // serviceHelper.compareAtendees(atendeeSpider, searchedAtendee);

  });

  test("t15_getAllAtendee", async () => {

    let atendee1 = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);
    let atendee2 = await serviceHelper.createAtendee(service, null, 'Meytal Cohen', null, 'meytalcohen@gmail.com', '123-76-7120');
    let atendee3 = await serviceHelper.createAtendee(service, null, 'Bio Gates', null, 'bil.gates@hotmail.com', '623-76-2255');

    let atendeeList = await service.findAll();

    expect(atendeeList.length).toEqual(3);
    expect(atendee1).toEqual(atendeeList[0]);
    expect(atendee2).toEqual(atendeeList[1]);
    expect(atendee3).toEqual(atendeeList[2]);

    //eliminate a warning in try-catch console
    await service.getOne(atendee1.id);
  });

  /*
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
*/
});