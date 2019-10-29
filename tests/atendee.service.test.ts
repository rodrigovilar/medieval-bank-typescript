import { AtendeeService } from "../src/atendee/atendee.service";
import { Atendee } from "../src/atendee/atendee";

describe('AtendeeServiceTest', () => {

    let service = new AtendeeService();
    
    it('t01_createAtendee', function () {

        // create object
        let atendee = new Atendee();
        atendee.name = 'A name';
        // create service
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

    it('t03_atendeeNameDuplicated ', () =>{
        
        let atendee1 = new Atendee();
        atendee1.name = 'A name';
        service.create(atendee1);

        let atendee2 = new Atendee();
        atendee2.name = 'A name';
        try {
            service.create(atendee2);
            fail('Accepted atendee with duplicated name');
        } catch (ex) {
            expect('Atendee name cannot be duplicated').toEqual(ex.message);
        }
    });
});