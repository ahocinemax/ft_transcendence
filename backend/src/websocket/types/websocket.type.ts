import { Socket } from "socket.io";

type TCallback = (res: any) => void;

/**
 * This type extends the Socket class to facilitate the access and setup of useful data
 * such as the username and the lobbies attached to it
 */
export type AuthenticatedSocket = Socket & {
	data: { name: string;
		 // gameLobby?: GameLobby;
	};

//	addLobby: (lobby: ALobby) => void;

	emit: <T>(event: ServerEvents, data: T, callback?: TCallback) => boolean;
};

export enum ServerEvents {
	BallPosition		= "server.ballPosition",
	LobbyCreated		= "server.lobbyCreated",
	LobbyMessage		= "server.lobbyMessage",
	LobbyState			= "server.lobbyState",
	InvitedToLobby		= "server.invitedToLobby",
	InvitationDeclined	= "server.invitationDeclined",
	InvitationResponse	= "server.invitationResponse",
	AddedToLobby		= "server.addedToLobby",
}

export enum ServerChatEvents {
	IncomingMessage = "server.chat.incomingMessage",
	LobbyList = "server.chat.lobbyList",
	LobbyCreated = "server.chat.lobbyCreated",
	UserList = "server.chat.userList",
	UserBanned = "server.chat.userBanned",
	UserKicked = "server.chat.userKicked",
	UserMuted = "server.chat.userMuted",
	UserSetAdmin = "server.chat.userSetAdmin",
	UserListExceptMe = "server.chat.userListExceptMe",
	KickedFromLobby = "server.chat.kickedFromLobby",
	InLobby = "server.chat.inLobby",
	MutedFromLobby = "server.chat.mutedFromLobby",
	BlockedUsers = "server.chat.blockedUsers",
	LobbyDeleted = "server.chat.lobbyDeleted",
	Lobby = "server.chat.lobby",
  }
  