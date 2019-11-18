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
        private atendeeRepository: Repository<Atendee>
    ) { }


    // CREATE
    async create(atendee: Atendee): Promise<any> {
        return await this.atendeeRepository.save(atendee);
    }

    // READ
    async findAll(): Promise<Atendee[]> {
        return await this.atendeeRepository.find();
    }


    // UPDATE
    async update(atendee: Atendee): Promise<UpdateResult> {

        return await this.atendeeRepository.update(atendee.id, atendee);
    }

    // DELETE
    async delete(id): Promise<DeleteResult> {
        return await this.atendeeRepository.delete(id);
    }
}
