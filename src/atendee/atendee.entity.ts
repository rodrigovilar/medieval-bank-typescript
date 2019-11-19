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
    date: Date;

    @Column()
    email: string;

    @Column()
    ssn: string;

    getCreation(getCreation: any) {
        throw new Error("Method not implemented.");
    }

    setName(name: string) {
        this.name = name;
    }
}