import { Atendee } from './../atendee.entity';
import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotNullException } from '../../Exceptions/not-null-exception';

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
        this.validateWithoutName(atendee);
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

    private validateWithoutName(atendee: Atendee): void {
        if (atendee.name == null)
            throw new NotNullException('Name is mandatory');
    }
}
