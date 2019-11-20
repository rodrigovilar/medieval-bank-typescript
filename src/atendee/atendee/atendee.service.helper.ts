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

    public async tryCreateAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string,
        expectedExceptionMessage: string): Promise<void> {

        try {
            let createdAtendee = await this.createAtendee(service, atendee.name, atendee.email, atendee.ssn);
            fail(failMessage);
        } catch (error) {
            expect(expectedExceptionMessage).toEqual(error.message);
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