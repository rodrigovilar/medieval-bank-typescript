import { AtendeeService } from './atendee.service';
import { Atendee } from '../atendee.entity';


export class AtendeeServiceHelper {
    public tryDeleteAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string, expectedExceptionMessage: string) {
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

    public tryCreateAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string,
        expectedExceptionMessage: string): void {
        try {
            service.create(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }
    }

    public tryUpdateAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string,
        expectedExceptionMessage: string): void {
        try {
            service.update(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }
    }

    public createAtendee(service: AtendeeService, name: string, email: string, ssn: string): Atendee {
        let atendee = new Atendee();
        atendee.name = name;
        atendee.email = email;
        atendee.ssn = ssn;
        let at: Promise<Atendee> = service.create(atendee);
        at.then((value) => {
            atendee = value;
        })
        return atendee ;
    }

}