import { Controller, Post, Put, Body } from '@nestjs/common';
import { Atendee } from '../atendee.entity';
import { AtendeeService } from './atendee.service';

// url http://localhost:3000/atendee
@Controller('atendee')
export class AtendeeController {

    // The service will take care of the logic
    constructor(private antendeeService: AtendeeService) {
    }

    // end-point create
    // http://localhost:3000/atendee/create
    @Post('create')
    async create(@Body() atendeeDate: Atendee): Promise<any> {
        return await this.antendeeService.create(atendeeDate);
    }

    // @Put(':id/update')
    // async update()


}
