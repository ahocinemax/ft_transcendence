
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
import { BlockService } from './block.service';

@Controller('block')
export class BlockController {
    constructor(private readonly blockService: BlockService ) {}

    @Get(':name')
    async getBlockUser(@Req() req: Request) {
        return this.blockService.getBlockUser(req.params.name);
    }
    
    @Get(':name/blockedOf')
    async getBlockUserOf(@Req() req: Request) {
        return this.blockService.getBlockUserOf(req.params.name);
    }
    
    @Patch(':name/:userToBlock')
    async blockUser(
        @Param('name') name: string,
        @Param('userToBlock') userToBlock: string,
    ) {
        return this.blockService.blockUser(name, userToBlock);
    }

    @Delete('remove/:name/:friend')
    async deleteBlock(
        @Param('name') name: string,
        @Param('friend') friend: string,
    ) {
        return this.blockService.deleteBlock(name, friend);
    }
}
