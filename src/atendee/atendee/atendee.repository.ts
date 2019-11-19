import { Atendee } from './../atendee.entity';
import { Repository } from 'typeorm';

export interface AtendeeRepository extends Repository<Atendee> {
    
}