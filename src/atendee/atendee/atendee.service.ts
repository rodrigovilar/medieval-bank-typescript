import { Atendee } from './../atendee.entity';
import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AtendeeException } from '../../Exceptions/atendee-exception';

/**
 * This class will be responsible for the logic of CRUD.
 */
@Injectable()
export class AtendeeService {
  constructor(
    // The atendeeRepository will take care of CRUD
    @InjectRepository(Atendee)
    private readonly atendeeRepository: Repository<Atendee>,
  ) { }

  // CREATE
  async create(atendee: Atendee): Promise<Atendee> {
    this.validateWithoutName(atendee);
    await this.validateId(atendee);
    await this.validateDuplicatedName(atendee);
    this.validateEmail(atendee);
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
    await this.validateGetOne(id);
    return await this.atendeeRepository.findOne(id);
  }

  // UPDATE
  async update(atendee: Atendee): Promise<Atendee> {
    this.atendeeRepository.update(atendee.id, atendee);
    return await this.getOne(atendee.id);
  }

  // DELETE
  async delete(id: number): Promise<DeleteResult> {
    await this.validateGetOne(id);
    return await this.atendeeRepository.delete(id);
  }

  private validateWithoutName(atendee: Atendee): void {
    if (atendee.name == null) throw new AtendeeException('Name is mandatory');
  }

  private async validateDuplicatedName(atendee: Atendee): Promise<void> {
    let createdAtendee = await this.atendeeRepository.findOne({
      name: atendee.name,
    });
    if (createdAtendee != undefined)
      throw new AtendeeException('Atendee name cannot be duplicated');
  }

  private async validateId(atendee: Atendee): Promise<void> {
    let createdAtendee = await this.atendeeRepository.findOne({
      id: atendee.id,
    });
    if (createdAtendee != undefined)
      throw new AtendeeException('Atendee id cannot be set');
  }

  private validateDate(atendee: Atendee): void {
    if (atendee.date != null)
      throw new AtendeeException('Atendee date cannot be set');
  }

  private validateEmail(atendee: Atendee): void {
    let regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    let serchfind = regexp.test(atendee.email);

    if (serchfind == false)
      throw new AtendeeException('Atendee e-mail format is invalid');
  }

  private async validateGetOne(id: number): Promise<void> {
    let createdAtendee = await this.atendeeRepository.findOne(id);
    if (createdAtendee == undefined)
      throw new AtendeeException('Atendee not found id: ' + id);
  }
}
