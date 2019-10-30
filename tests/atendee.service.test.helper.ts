import { Atendee } from '../src/atendee/atendee';
import { AtendeeService } from '../src/atendee/atendee.service';

export class AtendeeServiceHelper{

    public validateAtendee(aName: string, anEmail: string, createdAtendee: Atendee): void {
        expect(createdAtendee.id).not.toBeNull;
        expect(createdAtendee.date).not.toBeNull;
        expect(createdAtendee.name).toEqual(aName);
        expect(createdAtendee.email).toEqual(anEmail);
    }

    public tryCreateAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string,
        expectedExceptionMessage: string): void {
        try {
            service.create(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }
    }

    public createAtendee(service: AtendeeService,name: string, email: string): Atendee {
        let atendee = new Atendee();
        atendee.name = name;
        atendee.email = email;
        service.create(atendee);

        return service.create(atendee);
    }
}
