import { Atendee } from './../atendee.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
    private readonly atendeeRepository: Repository<Atendee>) { }

  // CREATE
  async create(atendee: Atendee): Promise<Atendee> {
    this.validateWithoutName(atendee);
    await this.validateId(atendee);
    await this.validateDuplicatedName(atendee);
    if (atendee.email) {
      this.validateEmail(atendee);
    }
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

    if (atendee.name == undefined || atendee.name == null || atendee.name == '')
      throw new Error('Name is mandatory');

    let searchedAtendee: Atendee;
    try {
      searchedAtendee = await this.atendeeRepository.findOneOrFail({ id: atendee.id });
    } catch (error) {
      throw new Error(`Atendee id not found: ${atendee.id}`)
    }

    if (atendee.ssn != searchedAtendee.ssn)
      throw new Error('Atendee SSN is immutable');

    if (atendee.date.getTime() != searchedAtendee.date.getTime()) {
      throw new Error('Atendee creation date cannot be changed');
    }

    if (await this.haveDuplicateName(searchedAtendee, atendee)) {
      throw new Error('Atendee name cannot be duplicated')
    }

    this.validateEmail(atendee);

    this.atendeeRepository.update(atendee.id, atendee);
    return await this.getOne(atendee.id);
  }

  // DELETE
  async delete(id: number): Promise<DeleteResult> {
    await this.validateDelete(id);
    return await this.atendeeRepository.delete(id);
  }

  async deleteAll() {
    return await this.atendeeRepository.clear();
  }

  async filterByField(field: string, value: string): Promise<Atendee[]> {

    // script sqlite
    let query: string = `SELECT * FROM atendee WHERE ${field} LIKE '%${value}%'`;
    //console.log('query: ', query);
    let list: Atendee[] = await this.atendeeRepository.query(query);

    //console.log('<><<><')
    //console.log(list)

    return list;
  }


  private validateEmail(atendee: Atendee): void {
    let rgx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    if (!rgx.test(atendee.email)) {
      throw new Error('Atendee e-mail format is invalid');
    }
  }

  private validateWithoutName(atendee: Atendee): void {
    if (atendee.name == null)
      throw new Error('Name is mandatory');
  }

  private async haveDuplicateName(searchedAtendee: Atendee, atendee: Atendee): Promise<boolean> {
    try {
      searchedAtendee = await this.atendeeRepository.findOneOrFail({ name: atendee.name });
      if (searchedAtendee.id !== atendee.id) {

        return true;
      }
    }
    catch (e) { }

    return false;
  }

  private async validateId(atendee: Atendee): Promise<void> {
    let createdAtendee = await this.atendeeRepository.findOne({
      id: atendee.id,
    });
    if (createdAtendee != undefined)
      throw new AtendeeException('Atendee id cannot be set');
  }


  private async validateDuplicatedName(atendee: Atendee): Promise<void> {
    let createdAtendee = await this.atendeeRepository.findOne({
      name: atendee.name,
    });
    if (createdAtendee != undefined)
      throw new AtendeeException('Atendee name cannot be duplicated');
  }


  private validateDate(atendee: Atendee): void {
    if (atendee.date != null)
      throw new AtendeeException('Atendee date cannot be set');
  }

  private async validateDelete(id: number) {
    let createdAtendee = await this.getOne(id);

    if (createdAtendee == undefined) {
      throw new AtendeeException('Atendee not found id: ' + id);
    }
  }

}
