import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Entity decorator
@Entity()
export class Demand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false, default: false})
    alocated: boolean;

    toString() {
        return this.name;
    }

}
