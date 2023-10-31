import { Module } from '@nestjs/common';
import { MuteController } from './mute.controller';
import { MuteService } from './mute.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MuteController],
    providers: [MuteService],
})
export class MuteModule {}
