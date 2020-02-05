import { Injectable } from '@nestjs/common';
import {Demand} from './demand.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@Injectable()
export class DemandService {

    constructor(@InjectRepository(Demand) private readonly demandRepository: Repository<Demand>) {}

    async create(demand: Demand) {
        this.validateName(demand);

        return await this.demandRepository.save(demand);
    }

    async delete(id: number) {
        return await this.demandRepository.delete(id);
    }

    validateName(demand: Demand) {
        if (!demand.name) {
            throw new Error('Demand name cannot be null');
        }
    }

    async findAll(): Promise<Demand[]> {
        return await this.demandRepository.find();
    }

    async findAllUnallocated(): Promise<Demand[]> {
        return await this.demandRepository.find({alocated: false});
    }

    async deleteAll() {
        return await this.demandRepository.clear();
    }

    async update(demand: Demand) {
        const newDemand: Demand = new Demand();
        newDemand.alocated = demand.alocated;
        newDemand.id = demand.id;
        newDemand.name = demand.name;

        await this.demandRepository.update(demand.id, newDemand);
    }
}
