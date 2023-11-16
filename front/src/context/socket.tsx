import { defaultSocketContextState, SocketContextProvider, SocketReducer } from './socketContext';
import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './userContent';
import { useSocket } from './useSocket';
import './socket.css'; 

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const {children} = props;
	const navigate = useNavigate();
	const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
	const [loading, setLoading] = useState(true);
	const name = useUserContext().userName.userName;
	const socket = useSocket(`${process.env.REACT_APP_SERVER_HOST}/`, {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
		query: { name: name },
		transports: ['websocket'],
		extraHeaders: {'Access-Control-Allow-Origin': `${process.env.REACT_APP_SERVER_HOST}`}
	});
	const [isInvited, setIsInvited] = useState(false);
	const [mode, setMode] = useState('');
	const [opponentName, setOpponnentName] = useState('');

	const accept = () => {
		socket.emit('duel response', opponentName, mode, true);
		setIsInvited(false);
	}

	const decline = () => {
		socket.emit('duel response', opponentName, mode, false);
		setIsInvited(false);
	}

	const invitationPopup = () => {
		return (
		<div className="waiting_popup">
			<div className="waiting_popup_container">
				<h1 className="game_mode_title">{mode}</h1>
				<h2 className="h1_popup_waiting">{opponentName} challenged you for a '{mode}' game</h2>
				<button className="accept_button" onClick={accept}>Accept</button>
				<button className="decline_button" onClick={decline}>Decline</button>
			</div>
		</div>);
	}

	const SendHandshake = () => {
		console.info(`Sending handshake to server...`);

		socket.emit('handshake');
		socket.on('handshake', (users: any) => {
			SocketDispatch({type: 'update_name', payload: name});
			SocketDispatch({type: 'update_users', payload: users});
			console.info('Handshake completed');
		});
	};

	const StartListeners = () => {
		socket.io.on('reconnect', (attempt) => {
			console.info(`Reconnected on attempt: `, attempt);
		});
		socket.io.on('reconnect_attempt', (attempt) => {
			console.info(`Reconnection attempt: `, attempt);
		});
		socket.io.on('reconnect_error', (error) => {
			console.error(`Reconnection error: `, error);
		});
		socket.io.on('reconnect_failed', () => {
			alert(`unable to connect to the websocket.`);
		});
		socket.io.on('error', (error) => {
			console.error(`Socket error: `, error);
		});
	};

	useEffect(() => {
		if (!name) return setLoading(false);
		socket.io.opts.query!.name = name;
		if (!socket.connected) socket.connect();
		SocketDispatch({type: 'update_socket', payload: socket});
		StartListeners();
		SendHandshake();
	}, [name, socket]);

	useEffect(() => {
		socket.on('user_connected', (users: string[]) => {
			SocketDispatch({type: 'update_users', payload: users});
		});

		socket?.on('user_inGame', (users: string[]) => {
			SocketDispatch({type: 'update_busy', payload: users})
		});

		socket.on('disconnect', (name: string) => {
			console.info('User disconnected');
			SocketDispatch({type: 'remove_user', payload: name});
		});

		socket.on('user_disconnected', (users: string[]) => {
			SocketDispatch({type: 'update_users', payload: users});
		});

		socket.on('exception', (error: string) => {
			console.error(`Socket error: `, error);
		});

		socket.on('duel request', (data: {name: string, mode: string}) => { 
			navigate('/start');
			setIsInvited(true);
			setMode(data.mode);
			setOpponnentName(data.name);
		});

		return () => {
			socket.off('user_connected');
			socket.off('disconnect');
			socket.off('user_disconnected');
			socket.off('error');
		};
	}, [socket]);

	return loading ? (<p>"Loading socket IO..."</p>) :
		(<SocketContextProvider value={{SocketState, SocketDispatch}}>
			{isInvited && invitationPopup()}
			{children}
		</SocketContextProvider>);
};

export default SocketContextComponent;
