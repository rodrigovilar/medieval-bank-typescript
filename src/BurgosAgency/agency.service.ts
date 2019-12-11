import { AtendeeService } from 'src/atendee/atendee/atendee.service';
import { Injectable } from '@nestjs/common';
import { Atendee } from 'src/atendee/atendee.entity';
import {DemandService} from '../demand/demand.service';
import {Demand} from '../demand/demand.entity';

@Injectable()
export class AgencyService {
    private atendeeService: AtendeeService;
    private demandService: DemandService;
    private name: string;
    private manager: string;
    private tick: number = 0;
    private queue: any [] = [];

    async addAtendee(attendee: Atendee) {
        try {
            await this.atendeeService.create(attendee);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async increaseTick() {
        this.tick++;
    }

    async addDemand(demand: Demand) {
        try {
            await this.demandService.create(demand);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async deleteDemand(demand: Demand) {
        try {
            await this.demandService.delete(demand.id);
        } catch (e) {
            throw new Error(e.message);
        }
    }

    async deleteAtendee(attendee: Atendee) {
        try {
            await this.atendeeService.delete(attendee.id);
       } catch (e) {
            throw new Error(e.message);
        }
    }

    async getStatus(): Promise<string> {
        const atendeeList = await this.atendeeService.findAll();
        const demandList = await this.demandService.findAll();
        return `Atendees: [${atendeeList.toString()}]\nQueue: [${demandList.toString()}]\nTick: ${this.tick}`;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getManager(): string {
        return this.manager;
    }

    public setManager(name: string): void {
        this.manager = name;
    }

    public getAtendeeService() {
        return this.atendeeService;
    }

    public setAtendeeService(atendeeService: AtendeeService) {
        this.atendeeService = atendeeService;
    }

    public getDemandService() {
        return this.demandService;
    }

    public setDemandService(demandService: DemandService) {
        this.demandService = demandService;
    }
}
