import { AtendeeRepository } from './atendee.repository';
import { Injectable } from '@nestjs/common';
import { Atendee } from '../atendee.entity';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * This class will be responsible for the logic of CRUD.
 */
@Injectable()
export class AtendeeService {

    constructor(
        // The atendeeRepository will take care of CRUD 
        @InjectRepository(Atendee)
        private readonly atendeeRepository: Repository<Atendee>
    ) { }

    // CREATE
    async create(atendee: Atendee): Promise<Atendee> {
        atendee.date = new Date();
        return await this.atendeeRepository.save(atendee);
    }

    // READ
    async findAll(): Promise<Atendee[]> {
        return await this.atendeeRepository.find();
    }

    // READ BY ID
    async getOne(id: number): Promise<Atendee> {
        return await this.atendeeRepository.findOne(id);
    }


    // UPDATE
    async update(atendee: Atendee): Promise<Atendee> {
        this.atendeeRepository.update(atendee.id, atendee);
        return await this.getOne(atendee.id);
    }

    // DELETE
    async delete(id): Promise<DeleteResult> {
        return await this.atendeeRepository.delete(id);
    }
}
