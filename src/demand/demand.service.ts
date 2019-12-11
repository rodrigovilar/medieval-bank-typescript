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

    async deleteAll() {
        return await this.demandRepository.clear();
    }
}
