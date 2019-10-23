import { AtendeeService } from "../src/atendee/atendee.service";
import { Atendee } from "../src/atendee/atendee";

describe('AtendeeServiceTest', () => {
    it('t01_createAtendee', function () {

        // create object
        let atendee = new Atendee();
        atendee.name = 'A name';

        // create service
        let service = new AtendeeService();
        const createdAtendee = service.create(atendee);

        expect(createdAtendee.id).not.toBeUndefined;
        expect(createdAtendee.date).not.toBeUndefined;

        const searchedAtendee = service.getOne(createdAtendee.id);

        expect(createdAtendee).toEqual(searchedAtendee);

    });
    it('t02_createAtendeeWithoutName ', () => {
        let atendee = new Atendee();
        let service = new AtendeeService();

        try {
            service.create(atendee);
            fail('Accepted atendee without name');
        } catch (ex) {
            expect('Name is mandatory').toEqual(ex.message);
        }
    });
});