import { AtendeeService } from "src/atendee/atendee/atendee.service";

export class AgencyService {
    private atendeeService: AtendeeService;
    private name: string;
    private manager: string;

    constructor(name: string, manager: string, atendeeService: AtendeeService){
        this.name = name;
        this.manager = manager;
        this.atendeeService = atendeeService
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getManager(): string{
        return this.manager;
    }

    public setManager(name: string): void {
        this.manager = name;
    }

    public getAtendeeService(){
        return this.atendeeService;
    }

    public setAtendeeService(atendeeService: AtendeeService){
        this.atendeeService = atendeeService;
    }
}   