import {useEffect, useRef} from 'react';
import io, {ManagerOptions, Socket, SocketOptions} from 'socket.io-client';

export const useSocket = (
	uri: string,
	opts?: Partial<ManagerOptions & SocketOptions> | undefined
): Socket => {
	const {current: socket} = useRef(io(uri, {
		...opts,
		// extraHeaders: {'Access-Control-Allow-Origin': `${process.env.REACT_APP_SERVER_HOST}`}
	}));

	useEffect(() => {
		return () => {
			if (socket) socket.close();
		};
	}, [socket]);
	return socket;
};
