import { Injectable } from '@nestjs/common';
import { Atendee } from '../atendee';

@Injectable()
export class AtendeeServiceService {
    getOne(id: number): Atendee {
		throw new Error("Method not implemented.");
	}

	create(atendee: Atendee): Atendee {
		throw new Error("Method not implemented.");
	}

	update(atendee: Atendee): Atendee {
		throw new Error("Method not implemented.");
	}

	delete(atendee: Atendee): Atendee {
		throw new Error("Method not implemented.");
	}

	getAll(): Atendee[] {
		throw new Error("Method not implemented.");
	}

	filterByField(field: string, value: string): Atendee[] {
		throw new Error("Method not implemented.");
	}
}
