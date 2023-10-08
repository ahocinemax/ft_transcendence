import { Global, Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { PrismaModule } from 'prisma/prisma.module';
import { WebsocketService } from './websocket.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketGateway, WebsocketService],
})

export class WebsocketModule {}
