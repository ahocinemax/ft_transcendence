import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { PrismaModule } from 'prisma/prisma.module';
import { BlockService } from 'src/block/block.service';

@Module({
  imports: [PrismaModule],
  providers: [WebsocketGateway, WebsocketService, BlockService],
  exports: [WebsocketGateway]
})
export class WebsocketModule {}
