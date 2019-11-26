import { AtendeeService } from './atendee.service';
import { Atendee } from '../atendee.entity';


export class AtendeeServiceHelper {
    public tryDeleteAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string, expectedExceptionMessage: string) {
        try {
            service.delete(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(ex.message).toEqual(expectedExceptionMessage);
        }
    }

    public validateAtendee(aName: string, anEmail: string, atendee: Atendee): void {
        expect(atendee.id).not.toBeNull();
        expect(atendee.date).not.toBeNull();
        expect(atendee.name).toEqual(aName);
        expect(atendee.email).toEqual(anEmail);
    }

    public async tryCreateAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string,
        expectedExceptionMessage: string): Promise<void> {

        try {
            let createdAtendee = await this.createAtendee(service, atendee.name, atendee.email, atendee.ssn);
            fail(failMessage);
        } catch (ex) {
            expect(ex.message).toEqual(expectedExceptionMessage);
        }
    }

    public async tryUpdateAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string,
        expectedExceptionMessage: string): Promise<void> {
        try {
            await service.update(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(ex.message).toEqual(expectedExceptionMessage);
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

    public async deleteAll(service: AtendeeService): Promise<void> {
        let atendeeList: Atendee[] = await service.findAll();

        if (atendeeList.length > 0) {
            // --- deletar todo mundo, porque pode ter vários mesmos nomes sendo criado acima nos outros testes
            atendeeList.forEach(async (atendee) => {
                await service.delete(atendee.id);
            });
        }
    }

}