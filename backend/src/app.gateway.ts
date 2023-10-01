import { Logger } from '@nestjs/common';
import { Status } from './user/status';
import { Server, Socket } from 'socket.io';
import { GameService } from './game/game.service';
import { UserService } from './user/user.service';
import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat/chat.gateway';
import { WebSocketGateway,
         WsException,
         OnGatewayConnection,
         OnGatewayDisconnect,
         BaseWsExceptionFilter,
         WebSocketServer,
         SubscribeMessage,
         MessageBody }
from '@nestjs/websockets';

@WebSocketGateway({ cors: { origin: process.env.FRONTEND_URI}});

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly chatService: ChatService,
        private readonly chatGateway: ChatGateway,
        private readonly userService: UserService,
    ) {}

    @WebSocketServer()
    server: Server;

    userStatusMap = new Map<number, Status>();
    clientSocketMap = new Map<number, Socket>();
    
}