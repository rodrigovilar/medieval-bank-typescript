import { Controller, Post, Put, Body, Param, Delete, Get } from '@nestjs/common';
import { Atendee } from '../atendee.entity';
import { AtendeeService } from './atendee.service';

// url http://localhost:3000/atendee
@Controller('atendees')
export class AtendeeController {

    // The service will take care of the logic
    constructor(private antendeeService: AtendeeService) { }

    // end-point create
    // http://localhost:3000/atendee/create
    @Post('create')
    async create(@Body() atendeeDate: Atendee): Promise<any> {
        return await this.antendeeService.create(atendeeDate);
    }

    // end-point, ex: http://localhost:3000/atendee/2/update
    // Passando o id e o atendee
    @Put(':id/update')
    async update(
        @Param('id') id: any,
        @Body() atendeeData: Atendee): Promise<any> {
        atendeeData.id = Number(id); // id é um dinâmico

        console.log(`Update # ${atendeeData}`);
        this.antendeeService.update(atendeeData);
    }


    // end-point,  ex: http://localhost:3000/atendee/2/delete
    @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
        return this.antendeeService.delete(id);
    }

    // Todas as requisões CRUD
    // http://localhost:3000/atendees
    @Get()
    index(): Promise<Atendee[]> {
        return this.antendeeService.findAll();
    }
}
