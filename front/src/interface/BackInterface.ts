
export interface User {
    id:             number;
    login42:        String;
    name:           String;
    email:          String;
    image:          String;
    gamesPlayed:    number;  
    gamesWon:       number; 
    status:         String;
    winRate:        Float32Array;
}
export interface Room {
	id: number;
	name: string;

	player1?: any;
	NamePlayer1: string;
	AvatarPlayer1: string;
	player1Disconnected: boolean;

	player2?: any;
	NamePlayer2: string;
	AvatarPlayer2: string;
	player2Disconnected: boolean;

	paddleLeft: number;
	paddleLeftDir: number;
	paddleRight: number;
	paddleRightDir: number;

	ScorePlayer1: number;
	ScorePlayer2: number;

	xball: number;
	yball: number;
	xSpeed: number;
	ySpeed: number;

	private: boolean;
	ballSpeed?: number;
	mode: string;
}
