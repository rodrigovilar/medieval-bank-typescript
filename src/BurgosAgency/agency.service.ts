import { AtendeeService } from "src/atendee/atendee/atendee.service";
import { Injectable } from "@nestjs/common";
import { Atendee } from "src/atendee/atendee.entity";

@Injectable()
export class AgencyService {
    
    private atendeeService: AtendeeService;
    private name: string;
    private manager: string;
    private queue: any [] = [];

    constructor(){
        
    }
    
    async addAtendee(attendee: Atendee) {
        try{
            await this.atendeeService.create(attendee);
        } catch (e){
            throw new Error(e.message);
        }
    }

    async deleteAtendee(attendee: Atendee) {
        try{
            await this.atendeeService.delete(attendee.id);
       } catch (e){
            throw new Error(e.message)
        }
    }

    async getStatus(): Promise<string> {
        const atendeeList = await this.atendeeService.findAll();
        return `Atendees: [${atendeeList.toString()}]\nQueue: [${this.queue.toString()}]`;
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