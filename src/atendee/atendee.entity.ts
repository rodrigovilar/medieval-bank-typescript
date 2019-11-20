import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, IsNotEmpty } from 'class-validator';

// Entity decorator
@Entity()
export class Atendee {


    // primary key
    @PrimaryGeneratedColumn()
    id: number;
    
    @IsNotEmpty()
    @Column()
    name: string;

    @Column()
    date: Date;

    @Column()
    email: string;

    @Column()
    ssn: string;
}