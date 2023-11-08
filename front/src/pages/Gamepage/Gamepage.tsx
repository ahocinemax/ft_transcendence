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
	// AUTANT ENREGISTRER UN STATE ROOM DIRECTEMENT (INTERFACE ROOM)
	// DEDANS IL Y AURAIT TOUTES LES DONNEES DE LA GAME

	// UNE FOIS LA PARTIE TERMINEE, IL FAUT ENVOYER UNE REQUETE POST AU BACK
	// POUR ENREGISTRER LA GAME DANS LA DB 
	// URL: '/Game/SaveGame'
	// BODY: { IdPalyer1, IdPalyer2, ScorePlayer1, ScorePlayer1, startTime, endTime, mode }

	// ET ENFIN REDIRIGER VERS LA PAGE DE FIN DE PARTIE
	// QUI AFFICHERA LES STATS DE LA GAME

	// CREER LES SOCKET.ON():
	//   - 'disconnected' QUI RENVOIE LE N° DU JOUEUR
	//   - 'game data' QUI RENVOIE LES DONNEES DE LA GAME
	//   - 'game over' QUI RENVOIE LE N° DU JOUEUR GAGNANT

	// send request only once:
	useEffect(() => {
		console.log("emmiting roomID: ", roomID.roomID);
		socket?.emit("room infos request", roomID.roomID);
	}, [socket]);

	useEffect(() => {
		socket?.on("room infos response", (response: Room) => {
			console.log("room infos: ", response);
			socket?.emit('start', response.name);
		});
		socket?.on("game data", (data: any) => {
			console.log("game data: ", data);
		});
		return () => {
			socket?.off("room infos response");
			socket?.off("game data");
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