import { Logger } from '@nestjs/common';
import { Status } from './user/status';
import { Server, Socket } from 'socket.io';
import { GameService } from './game/game.service';
import { UserService } from './user/user.service';
import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat/chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway,
         WsException,
         OnGatewayConnection,
         OnGatewayDisconnect,
         BaseWsExceptionFilter,
         WebSocketServer,
         SubscribeMessage,
         MessageBody }
from '@nestjs/websockets';

/**
 * The AppGateway class is responsible for handling WebSocket connections and disconnections.
 */
@WebSocketGateway({ cors: { origin: process.env.FRONT_URL}})
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

    private logger: Logger = new Logger('AppGateway');

    /**
     * Handles a new WebSocket connection.
     * @param client The WebSocket client that connected.
     * @param args Additional arguments passed to the connection handler.
     */
    async handleConnection(client: Socket, ...args: any[]) {
        try {
            client.setMaxListeners(10);
            const userId: number = 0;
        } catch (error) {
            throw new WsException(error.message);
        }

    }

    async handleDisconnect(client: Socket) {
        try {
            const userId: number = 0;
        } catch (error) {
            throw new WsException(error.message);
        }
    }
}