import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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

    @Column()
    email: string;

    @Column({ nullable: true })
    ssn: string;
}