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
    const TICK_RATE = 60; // Fréquence à laquelle le jeu se met à jour (en ms)
    const PLAYER_SPEED = 17.5; // La vitesse de déplacement du joueur
    const gameCanvasHeightVh = 68; // hauteur du Gamecanvas en vh
    const playerBarHeightVh = 13; // hauteur de Playerbar1 en vh
    const vhInPixels = (vh: number): number => (vh * window.innerHeight) / 100; // hauteur du canva en px
    const maxY = vhInPixels(gameCanvasHeightVh) - vhInPixels(playerBarHeightVh); // hauteur max du canva en pixels
    const [isUpPressed, setIsUpPressed] = useState(false);
    const [isDownPressed, setIsDownPressed] = useState(false);

    interface ServerResponse {
        player1Y: number;
        player2Y: number;
      }

    
    //// Gérer l'appui des touches ///////////////////
    useEffect(() => {
        // Définir les gestionnaires d'événements pour les touches
        const handleKeyDown = (event: KeyboardEvent) => {
          if (event.key === 'ArrowUp') setIsUpPressed(true);
          if (event.key === 'ArrowDown') setIsDownPressed(true);
        };
        const handleKeyUp = (event: KeyboardEvent) => {
          if (event.key === 'ArrowUp') setIsUpPressed(false);
          if (event.key === 'ArrowDown') setIsDownPressed(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
        };
      }, []);

    ////// MAJ DE LA POSITION DANS LE BACKEND ////////////
    useEffect(() => {
        const interval = setInterval(() => {
          let newPlayer1Y = playerBar1Y;
          let newPlayer2Y = playerBar2Y;
          
          if (isUpPressed) newPlayer1Y = Math.max(playerBar1Y - PLAYER_SPEED, 0);
          if (isDownPressed) newPlayer1Y = Math.min(playerBar1Y + PLAYER_SPEED, maxY);

          setPlayerBar1Y(newPlayer1Y);
          setPlayerBar2Y(newPlayer2Y);

          if(isUpPressed || isDownPressed)
            socket?.emit("up arrow", roomID.roomID);



          
          // envoyer la nouvelle direction (up/down)
          /* if ( isUpPressed ) socket?.emit("up arrow", roomID.roomID);
          else if ( isDownPressed ) socket?.emit("down arrow", roomID.roomID); */

          // Set the new Y positions -> It should call BACK HERE ***
          // recevoir les infos du back concernant la partie
          socket?.on("game data", ((data: any) => {
            // enregistrer les différentes infos dans mes variables
            console.log("data:", data);
            setPlayerBar1Y(newPlayer1Y);
            setPlayerBar2Y(newPlayer2Y);
          }))
          // utiliser ces variables pour les afficher
      
          // Here you would normally send the new position to the server
          // and then the server would respond with the "official" positions of the players
          // which you would then use to set the player bar positions
          // For now, we're just simulating this with local state updates
          
        }, 1000 / TICK_RATE);
        
        return () => clearInterval(interval);
      }, [isUpPressed, isDownPressed, playerBar1Y, playerBar2Y, TICK_RATE, PLAYER_SPEED, maxY]);
      
      function serverUpdate(inputs: { up: boolean; down: boolean }): Promise<ServerResponse> {
        return new Promise((resolve) => {
          let newPlayer1Y = playerBar1Y;
          let newPlayer2Y = playerBar2Y;
          
          // Assuming player 1 controls are local and instant, supposed to be calculated within back?
          if (inputs.up) newPlayer1Y = Math.max(playerBar1Y - PLAYER_SPEED, 0);
          if (inputs.down) newPlayer1Y = Math.min(playerBar1Y + PLAYER_SPEED, maxY);
          
          resolve({
            player1Y: newPlayer1Y,
            player2Y: newPlayer2Y,
          });
        });
      }

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
					{<div className="main_ball" style={{ left: ballX, top: ballY }}></div>}
				</div>
			</div>
		</div>
	);
}

export default Gamepage;