import {
    Controller,
	Delete,
	Get,
    Post,
	Param,
	Patch,
	Req,
	Res,
} from '@nestjs/common';
import { Request } from 'express';
import { MuteService } from './mute.service';

@Controller('mute')
export class MuteController {
    constructor(private readonly muteService: MuteService) {}

    @Get(':name')
    async getMuteUser(@Req() req: Request) {
        return this.muteService.getMuteUser(req.params.name);
    }
    
    @Patch('add/:name/:user')
    async addMuteUser(
        @Param('name') name: string,
        @Param('user') user: string,
    ) {
        return this.muteService.addMuteUser(name, user);
    }

    @Delete('remove/:name/:user')
    async deleteMutedUser(
        @Param('name') name: string,
        @Param('user') user: string,
    ) {
        return this.muteService.deleteMutedUser(name, user);
    }
}