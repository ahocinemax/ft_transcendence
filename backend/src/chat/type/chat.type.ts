export type Pair = {
	id: number;
	name: string;
};

export type chatPreview = {
	id: number;
	dm: boolean;
	name: string;
	isPassword: boolean;
	updateAt: string;
	lastMsg: string;
	unreadCount?: number;
	ownerEmail: string;
	ownerId: number;
};

export type oneMessage = {
	msgId: number;
	id: number;
	channelId: number;
	email: string;
	message: string;
	createAt: string;
	updateAt: string;
	isInvite: boolean;
};