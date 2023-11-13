import React, { createContext } from 'react';
import { Socket } from 'socket.io-client';

export interface ISocketContextState {
	socket: Socket | undefined;
	name: string;
	users: string[];
	isBusy: string[];
}

export const defaultSocketContextState: ISocketContextState = {
	socket: undefined,
	name: '',
	users: [],
	isBusy: [],
};

export interface ISocketContextActions {
	type: 'update_socket' | 'update_users' | 'remove_user' | 'update_name' | 'update_busy';
	payload: string | string[] | Socket;
}

export const SocketReducer = (
	state: ISocketContextState,
	action: ISocketContextActions
) => {
	switch (action.type) {
		case 'update_socket':
			return {...state, socket: action.payload as Socket};
		case 'update_users':
			return {...state, users: action.payload as string[]};
		case 'update_busy':
			return {...state, isBusy: action.payload as string[]};
		case 'remove_user':
			return {
				...state,
				users: state.users.filter((name) => name !== (action.payload as string)),
			};
		case 'update_name':
			return {...state, name: action.payload as string};
		default:
			return {...state};
	}
};

export interface ISocketContextProps {
	SocketState: ISocketContextState;
	SocketDispatch: React.Dispatch<ISocketContextActions>;
}

const SocketContext = createContext<ISocketContextProps>({
	SocketState: defaultSocketContextState,
	SocketDispatch: () => {},
});

export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
