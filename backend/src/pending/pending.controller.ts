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
import { PendingService } from './pending.service';

@Controller('pending')
export class PendingController {
    constructor(private readonly pendingService: PendingService) {}
    @Get(':name')
    async getPendingUser(@Req() req: Request) {
        return this.pendingService.getPendingUser(req.params.name);
    }
    
    @Get(':name/pendingOf')
    async getPendingUserOf(@Req() req: Request) {
        return this.pendingService.getPendingUserOf(req.params.name);
    }
    
    @Patch('add/:name/:pendingUser')
    async addPending(
        @Param('name') name: string,
        @Param('pendingUser') pendingUser: string,
    ) {
        return this.pendingService.addPending(name, pendingUser);
    }

    @Delete('delete/:name/:userToDelete')
    async deletePending(
        @Param('name') name: string,
        @Param('userToDelete') pendingUser: string,
    ) {
        return this.pendingService.deletePending(name, pendingUser);
    }
}
