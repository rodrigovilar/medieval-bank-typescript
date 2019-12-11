import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Entity decorator
@Entity()
export class Demand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    toString() {
        return this.name;
    }

}
