import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { PendingController } from './pending.controller';
import { PendingService } from './pending.service';

@Module({
    imports: [PrismaModule],
    controllers: [PendingController],
    providers: [PendingService],
})
export class PendingModule {}
