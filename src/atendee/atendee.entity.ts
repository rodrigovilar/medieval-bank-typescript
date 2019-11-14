import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// Entity decorator
@Entity()
export class Atendee {

    // primary key
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    date: Date | undefined;

    @Column()
    email: string;

    @Column()
    ssn: string;
}