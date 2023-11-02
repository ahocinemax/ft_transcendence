import {
    Controller,
	Get,
	Param,
	Patch,
	Req,
} from '@nestjs/common';
import { Request } from 'express';
import { BanService } from './ban.service';

@Controller('ban')
export class BanController {
    constructor(private readonly banService: BanService) {}

    @Get(':name')
    async getBanUser(@Req() req: Request) {
        return this.banService.getBanUser(req.params.name);
    }
    
    @Patch('add/:userName/:banUserName')
    async banUser(
        @Param('userName') userName: string,
        @Param('banUserName') banUserName: string,
    ) {
        return this.banService.banUser(userName, banUserName);
    }
}