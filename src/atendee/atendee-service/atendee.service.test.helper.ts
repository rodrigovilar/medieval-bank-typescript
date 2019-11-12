import { AtendeeServiceService } from './atendee-service.service';
import { Atendee } from '../atendee';

export class AtendeeServiceHelper {
    public tryDeleteAtendeeWithError(service: AtendeeServiceService, atendee: Atendee, failMessage: string, expectedExceptionMessage: string) {
        try {
            service.delete(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }
    }

    public validateAtendee(aName: string, anEmail: string, createdAtendee: Atendee): void {
        expect(createdAtendee.id).not.toBeNull();
        expect(createdAtendee.date).not.toBeNull();
        expect(createdAtendee.name).toEqual(aName);
        expect(createdAtendee.email).toEqual(anEmail);
    }

    public tryCreateAtendeeWithError(service: AtendeeServiceService, atendee: Atendee, failMessage: string,
        expectedExceptionMessage: string): void {
        try {
            service.create(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }
    }

    public tryUpdateAtendeeWithError(service: AtendeeServiceService, atendee: Atendee, failMessage: string,
        expectedExceptionMessage: string): void {
        try {
            service.update(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }
    }

    public createAtendee(service: AtendeeServiceService, name: string, email: string, ssn: string): Atendee {
        let atendee = new Atendee();
        atendee.name = name;
        atendee.email = email;
        atendee.ssn = ssn;
        service.create(atendee);

        return service.create(atendee);
    }

}
