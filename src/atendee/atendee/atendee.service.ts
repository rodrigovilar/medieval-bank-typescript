import { Atendee } from './../atendee.entity';
import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotNullException } from '../../Exceptions/not-null-exception';
import { NotDuplicatedException } from '../../Exceptions/not-duplicated-exception';
import { ExistObject } from '../../Exceptions/exist-object';

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
        await this.validateId(atendee);
        await this.validateDuplicatedName(atendee);
        this.validateDate(atendee);
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

    //GET ID
    async getId(atendee: Atendee): Promise<number> {
        return await this.atendeeRepository.getId(atendee)
    }

    private validateWithoutName(atendee: Atendee): void {
        if (atendee.name == null)
            throw new NotNullException('Name is mandatory');
    }

    private async validateDuplicatedName(atendee: Atendee): Promise<void> {
        await this.findAll().then(createdAtendees => {
            createdAtendees.forEach(value => {
                if (value.name == atendee.name)
                    throw new NotDuplicatedException('Atendee name cannot be duplicated');
            })
        })
    }

    private async validateId(atendee: Atendee): Promise<void> {
        let createdAtendees = await this.findAll();
        createdAtendees.forEach(value => {
            if (value.id == atendee.id)
                throw new ExistObject('Atendee id cannot be set');
        })
    }

    private validateDate(atendee: Atendee): void {
        if (atendee.date != null)
            throw new NotNullException('Atendee date cannot be set');
    }
}
