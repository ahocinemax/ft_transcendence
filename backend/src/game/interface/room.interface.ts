import { Client } from './client.interface';

export interface Room {
	id: number;
	name: string;

	player1?: Client;
	NamePlayer1: string;
	AvatarPlayer1: string;
	player1Disconnected?: boolean;

	player2?: Client;
	NamePlayer2: string;
	AvatarPlayer2: string;
	player2Disconnected?: boolean;

	paddleLeft: number;
	paddleLeftDir: number;
	paddleRight: number;
	paddleRightDir: number;

	ScorePlayer1: number;
	ScorePlayer2: number;

	xball?: number;
	yball?: number;
	xSpeed?: number;
	ySpeed?: number;

	private: boolean;
	ballSpeed?: number;
	mode: string;
}
