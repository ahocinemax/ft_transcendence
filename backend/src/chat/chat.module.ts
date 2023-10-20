import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { WebsocketService } from 'src/websocket/websocket.service';

@Module({
    imports: [forwardRef(() => PrismaModule), forwardRef(() => UserModule)],
    providers: [ChatGateway, ChatService, WebsocketService],
    exports: [ChatService, ChatGateway],
})
export class ChatModule {}
