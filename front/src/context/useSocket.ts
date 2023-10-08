import {useEffect, useRef} from 'react';
import io, {ManagerOptions, Socket, SocketOptions} from 'socket.io-client';
import { backFunctions } from '../outils_back/BackFunctions';
import { NavigateFunction } from 'react-router-dom';

export const useSocket = (
	uri: string,
	opts?: Partial<ManagerOptions & SocketOptions> | undefined
): Socket => {
	const {current: socket} = useRef(io(uri, opts));

	useEffect(() => {
		return () => {
			if (socket) socket.close();
		};
	}, [socket]);
	return socket;
};
