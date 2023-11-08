import {
    Controller,
	Get,
	Param,
	Post,
	Req,
    Body,
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
    
    @Post('add/:userName/:banUserName')
    async banUser(
        @Body('channelId') channelId: number,
        @Param('userName') userName: string,
        @Param('banUserName') banUserName: string,
    ) {
        return this.banService.banUser(userName, banUserName, channelId);
    }
}