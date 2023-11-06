import React, { useState, useEffect, useContext } from 'react';
import SocketContext from '../../context/socketContext';
import { useUserContext } from '../../context/userContent';
import { Room } from '../../interface/BackInterface';
import './Gamepage.css';

function Gamepage() {
	const { socket } = useContext(SocketContext).SocketState;
	const [playerBar1Y, setPlayerBar1Y] = useState(150);
	const [playerBar2Y, setPlayerBar2Y] = useState(150);
	const [ballX, setBallX] = useState(0); // Position horizontale de la balle
  	const [ballY, setBallY] = useState(0); // Position verticale de la balle
	const { roomID } = useUserContext();

	// send request only once:
	useEffect(() => {
		console.log("emmiting roomID: ", roomID.roomID);
		socket?.emit("room infos request", roomID.roomID);
	}, [socket]);

	useEffect(() => {
		socket?.on("room infos response", (response: Room) => {
			console.log("room infos: ", response);
		});
		return () => {
			socket?.off("room infos response");
		}
	}, [socket]);

	let lastTimestamp = 0;

	return (
		<div className="Gamebackground">
			<div className="Gamepage">
				<div className="Gamecanvas">
					<div className="MiddleLine"></div>
					<div className="Player1Area" style={{ left: 0 }}>
						<div className="Playerbar1" style={{ top: playerBar1Y }}></div>
					</div>
					<div className="Player2Area" style={{ right: 0 }}>
						<div className="Playerbar2" style={{ top: playerBar2Y }}></div>
					</div>
					{<div className="Ball" style={{ left: ballX, top: ballY }}></div>}
				</div>
			</div>
		</div>
	);
}

export default Gamepage;