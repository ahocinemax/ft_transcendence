import { AuthenticatedSocket } from 'src/websocket/types/websocket.type';

export interface Player {
	roomId: number;
	playerNb: number;
}

export interface waitingPlayer {
	name: string;
	socket: AuthenticatedSocket;
	avatar: string;
}
