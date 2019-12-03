import { Controller, Post, Put, Body, Param, Delete, Get } from '@nestjs/common';
import {AgencyService} from './agency.service';


// url http://localhost:3000/atendee
@Controller('agencies')
export class AgencyController {

    // The service will take care of the logic
    constructor(private agencyService: AgencyService) { }

    // end-point create
    // http://localhost:3000/atendee/create
    @Post('status')
    async status(): Promise<any> {
        return await this.agencyService.getStatus();
    }
}