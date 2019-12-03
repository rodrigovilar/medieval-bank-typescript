import { AtendeeService } from "src/atendee/atendee/atendee.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AgencyService {
    
    private atendeeService: AtendeeService;
    private name: string;
    private manager: string;

    constructor(){
        
    }

    getStatus(): any {
        throw new Error("Method not implemented.");
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