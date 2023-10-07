import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
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
         OnGatewayInit,
         BaseWsExceptionFilter,
         WebSocketServer,
         SubscribeMessage,
         MessageBody }
from '@nestjs/websockets';

/**
 * The AppGateway class is responsible for handling WebSocket connections and disconnections.
 */
@WebSocketGateway({ cors: { origin: process.env.FRONT_URL}})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    constructor(
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
            client.setMaxListeners(42);
            const user = await this.userService.getUser(args[0]);
            const userId = user.id;
            client.data.id = userId;
            if (!user)
                throw new WsException('Invalid token');
            
            this.logger.log(`Connect client: ${userId}`);
            this.userStatusMap.set(client.data.id, Status.online);
            const serializedMap = [...this.userStatusMap.entries()];
            this.server.emit('update-status', serializedMap);
            await this.clientSocketMap.set(userId, client);
            await this.chatGateway.newConnection(userId, client);
        } catch (error) {
            return false;
        }
    }

    async handleDisconnect(client: Socket) {
        // Chat part
        if (client.data.id !== undefined) {
            this.userStatusMap.set(client.data.id, Status.offline);
            const serializedMap = [...this.userStatusMap.entries()];
            this.server.emit('update-status', serializedMap);
            await this.clientSocketMap.delete(client.data.id);
        }
        // Game part
        if (false)
            return ;

        client.removeAllListeners();
    }

    async afterInit() {
        this.logger.log('AppGateway Initialized!!');
        this.logger.log(`Server is running`);
    }
}

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) { super.catch(exception, host); }
}