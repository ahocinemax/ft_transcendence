export interface userModel {
	id: number;
	name: string;
	image: string;
	friends: Array<userModel>;
	blocked: Array<userModel>;
	gamesLost: number;
	gamesPlayed: number;
	gamesWon: number;
	rank: number;
	score: number;
	winRate: number;
	gameHistory: Array<any>;
}

export interface channelModel {
	id: number;
	dm: boolean;
	name: string;
	isPrivate: boolean;
	password: string;
	updateAt: string;
	lastMsg: string;
	unreadCount?: number;
	ownerEmail: string;
	ownerId: number;
}

export interface gameModel {
	id: number;
	player1: number;
	ScorePlayer1: number;
	player2: number;
	ScorePlayer2: number;
	startTime: string;
	endTime: string;
	duration: number;
	victory: boolean;
}