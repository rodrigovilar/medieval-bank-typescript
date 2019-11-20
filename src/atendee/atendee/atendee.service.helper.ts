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

    public validateAtendee(aName: string, anEmail: string, atendee: Atendee): void {
        expect(atendee.id).not.toBeNull();
        expect(atendee.date).not.toBeNull();
        expect(atendee.name).toEqual(aName);
        expect(atendee.email).toEqual(anEmail);
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

    public async createAtendee(service: AtendeeService, name: string, email: string, ssn: string): Promise<Atendee> {
        let atendee = new Atendee();
        atendee.name = name;
        atendee.email = email;
        atendee.ssn = ssn;

        let createdAtendee = await service.create(atendee)
        this.validateAtendee(name, email, createdAtendee)
        return createdAtendee;
    }

}