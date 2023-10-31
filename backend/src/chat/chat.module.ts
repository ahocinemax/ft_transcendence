import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
    imports: [forwardRef(() => PrismaModule), forwardRef(() => UserModule)],
    providers: [ChatGateway, ChatService, WebsocketGateway],
    exports: [ChatService, ChatGateway],
})
export class ChatModule {}
