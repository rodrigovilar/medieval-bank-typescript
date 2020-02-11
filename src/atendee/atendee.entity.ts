import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import { Demand } from '../demand/demand.entity';

// Entity decorator
@Entity()
export class Atendee {

    // primary key
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    date: Date;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    ssn: string;

    @OneToOne(type => Demand)
    @JoinColumn()
    demand: Demand;

    toString(): string {
        if (this.demand == null) {
            return this.name;
        } else {
            return `${this.name}->${this.demand.name}`;
        }
    }
}
