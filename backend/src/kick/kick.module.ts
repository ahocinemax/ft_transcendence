import { Module } from '@nestjs/common';
import { KickController } from './kick.controller';
import { KickService } from './kick.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [KickController],
    providers: [KickService],
})
export class KickModule {}
