export interface userModel {
	id: number;
	name: string;
	image: string;
	friends: Array<userModel>;
	gamesLost: number;
	gamesPlayed: number;
	gamesWon: number;
	rank: number;
	score: number;
	winRate: number;
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