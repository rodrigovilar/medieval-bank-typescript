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

  // delete all atendees
  afterEach(async () => {
    serviceHelper.deleteAll(service)
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });


  it('t01_createAtendee', async () => {
    let createdAtendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, null);
    let searchedAtendee = await service.getOne(createdAtendee.id)

    expect(createdAtendee).toEqual(searchedAtendee);
    expect('Cuscuz').toEqual('Cuscuz');
  });

  it('t02_createAtendeeWithoutName ', async () => {

    let atendee: Atendee = new Atendee();

    atendee.name = null;
    atendee.email = 'Elza';
    atendee.ssn = EXAMPLE_SSN;


    const failMessage: string = 'Test failed because the system accepted to create atendee without name';

    const expectedExceptionMessage: string = 'Name is mandatory';

    await serviceHelper.tryCreateAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);

  });

  it('t03_atendeeNameDuplicated', async () => {

    // creating first atendee
    await serviceHelper.createAtendee(service, null, 'Carlos', null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    // creating second atendee
    let atendee2 = new Atendee();

    atendee2.name = 'Carlos'; // The same name!
    atendee2.email = EXAMPLE_EMAIL;
    atendee2.ssn = EXAMPLE_SSN;

    const failMessage: string = 'Test failed because the system accepted to create atendee with duplicated name';

    const expectedExceptionMessage: string = "Atendee name cannot be duplicated";

    await serviceHelper.tryCreateAtendeeWithError(service, atendee2, failMessage, expectedExceptionMessage);
  });

  it('t04_createAtendeeWithAutomaticFields', async () => {

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

  it('t05_createAtendeeWithInvalidEmail', async () => {

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

  /*
    it('t06_updateAtendee', async () => {
  
      let createdAtendee = await serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);
  
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
  
    it('t07_updateAtendeeWithImmutableFields', async () => {
  
      let createdAtendee = await serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);
  
      createdAtendee.ssn = '670-03-8924';
  
      const failMessage: string = 'Test failed because the system accepted to update atendee with a new SSN';
      const expectedExceptionMessage: string = 'Atendee SSN is immutable';
  
      await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);
  
    });
  
  
    it('t08_updateAtendeeWithUnknownId', async () => {
  
      let atendeeUnknownId: Atendee = new Atendee();
      atendeeUnknownId.id = UNKNOWN;
      atendeeUnknownId.name = EXAMPLE_NAME;
  
      let failMessage: string = 'Test failed because the system accepted to update atendee with unknown id';
      let expectedExceptionMessage: string = `Atendee id not found: ${UNKNOWN}`;
  
      await serviceHelper.tryUpdateAtendeeWithError(service, atendeeUnknownId, failMessage, expectedExceptionMessage);
  
      let createdAtendee: Atendee = await serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);
  
      createdAtendee.id = UNKNOWN;
      createdAtendee.name = 'Meytal cohen';
      createdAtendee.email = 'meytal.cohen@gmail.com';
  
      failMessage = 'Test failed because the system accepted to update atendee with unknown id';
      expectedExceptionMessage = `Atendee id not found: ${UNKNOWN}`;
  
      await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);
    });
  
    it('t09_updateAtendeeWithoutName', async () => {
  
      let createdAtendee: Atendee = await serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);
  
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
  
    it('t10_updateAtendeeWithDuplicatedName', async () => {
  
      await serviceHelper.createAtendee(service, EXAMPLE_NAME, EXAMPLE_EMAIL, EXAMPLE_SSN);
      let createdAtendee: Atendee = await serviceHelper.createAtendee(service, 'Meytal cohen', EXAMPLE_EMAIL, EXAMPLE_SSN);
  
      createdAtendee.name = EXAMPLE_NAME;
  
      const failMessage: string = 'Test failed because the system accepted to update atendee with duplicated mandatory fields';
      const expectedExceptionMessage: string = 'Atendee name cannot be duplicated';
  
      await serviceHelper.tryUpdateAtendeeWithError(service, createdAtendee, failMessage, expectedExceptionMessage);
  
    });
  
    /*
   
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
   */
  it('t13_deleteAtendee', async () => {

    let atendee: Atendee = await serviceHelper.createAtendee(service, null, EXAMPLE_NAME, null, EXAMPLE_EMAIL, EXAMPLE_SSN);

    await service.delete(atendee.id);

    const expectedExceptionMessage = 'Atendee not found';
    const failMessage = "The test failed because the system returned the attendant when it should not have found";

    await serviceHelper.tryDeleteAtendeeSuccessfully(service, atendee, failMessage, expectedExceptionMessage);
  });
  it("t14_deleteAtendeeThatDoesNotExist", async () => {

    let atendee = new Atendee();
    atendee.id = 123;
    atendee.name = 'José';
    atendee.email = EXAMPLE_EMAIL;
    atendee.ssn = EXAMPLE_SSN;

    const expectedExceptionMessage = 'Atendee not found';
    const failMessage = "Test failed because system 'deleted' an attendant that does not exist";

    await serviceHelper.tryDeleteAtendeeWithError(service, atendee, failMessage, expectedExceptionMessage);
  });
  /*
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
   */
});
