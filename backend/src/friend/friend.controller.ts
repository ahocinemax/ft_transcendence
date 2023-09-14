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
import { FriendService } from './friend.service';

@Controller('friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) {}

    @Get(':name')
    async getFriend(@Req() req: Request) {
        return this.friendService.getFriend(req.params.name);
    }
    
    @Patch(':name/:friend')
    async addFriend(
        @Param('name') name: string,
        @Param('friend') friend: string,
    ) {
        return this.friendService.addFriend(name, friend);
    }
}