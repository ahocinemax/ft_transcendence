import {
    Controller,
    Delete,
	Query,
	Param,
    ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { KickService } from './kick.service';

@Controller('kick')
export class KickController {
    constructor(private readonly kickService: KickService) {}
    
    @Delete('remove/:userName/:kickUserName')
    async banUser(
        @Query('channelId', ParseIntPipe) channelId: number,
        @Param('userName') userName: string,
        @Param('kickUserName') kickUserName: string,
    ) {
        return this.kickService.kickUser(userName, kickUserName, channelId);
    }
}