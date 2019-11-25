import { AtendeeService } from './atendee.service';
import { Atendee } from '../atendee.entity';


export class AtendeeServiceHelper {

    public async tryDeleteAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string, expectedExceptionMessage: string) {
        try {
            await service.delete(atendee.id);
            fail(failMessage);
        } catch (error) {
            expect(expectedExceptionMessage).toEqual(error.message);
        }
    }

    public async tryDeleteAtendeeSuccessfully(service: AtendeeService, atendee: Atendee, failMessage: string, expectedExceptionMessage: string) {
        try {
            let createdAtendee = await service.getOne(atendee.id);
            console.log(createdAtendee);
            fail(failMessage);
        } catch (error) {
            expect(expectedExceptionMessage).toEqual(error.message);
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
            await this.createAtendee(service, atendee.id, atendee.name, atendee.date, atendee.email, atendee.ssn);
            fail(failMessage);
        } catch (error) {
            expect(expectedExceptionMessage).toEqual(error.message);
        }
    }

    public async tryUpdateAtendeeWithError(service: AtendeeService, atendee: Atendee, failMessage: string,
        expectedExceptionMessage: string): Promise<void> {
        try {
            await service.update(atendee);
            fail(failMessage);
        } catch (ex) {
            expect(expectedExceptionMessage).toEqual(ex.message);
        }
    }

    public async createAtendee(service: AtendeeService, id: number, name: string, date: Date, email: string, ssn: string): Promise<Atendee> {
        let atendee = new Atendee();
        atendee.id = id;
        atendee.name = name;
        atendee.date = date;
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