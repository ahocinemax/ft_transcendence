import { Injectable } from '@nestjs/common';
import { BlockService } from 'src/block/block.service';
import { PrismaService } from 'prisma/prisma.service';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WebsocketService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly blockService: BlockService
        ){
            console.log('WebsocketService Initialized');
        }
        public io: Server;
        public clients: Socket;
        setIo(io: Server) {
            this.io = io;
            //console.log('IO set in WebsocketService:', this.io);
        }
}
