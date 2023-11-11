import React, { useState, useEffect, useContext, useRef } from 'react';
import SocketContext from '../../context/socketContext';
import { useUserContext } from '../../context/userContent';
import { useNavigate } from 'react-router-dom';
import { Room } from '../../interface/BackInterface';
import { debounce, throttle } from 'lodash';
import './Gamepage.css';

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

function Gamepage() {
	const { socket } = useContext(SocketContext).SocketState;
	const { roomID } = useUserContext();
  const ballRef = useRef<HTMLDivElement | null>(null);
  const player1Ref = useRef<HTMLDivElement | null>(null);
  const player2Ref = useRef<HTMLDivElement | null>(null);
  const TICK_RATE = 60; // Fréquence à laquelle le jeu se met à jour (en ms)
  const gameCanvasHeightVh = 68; // hauteur du Gamecanvas en vh
  const gameCanvasWidthVw = 68; // largeur du Gamecanvas en vw
  const playerBarHeightVh = 13; // hauteur de Playerbar1 en vh
  const vhInPixels = (vh: number): number => (vh * window.innerHeight) / 100; // hauteur du canva en px
  const vwInPixels = (vw: number): number => (vw * window.innerWidth) / 100; // largeur du canva en px
  const maxY = vhInPixels(gameCanvasHeightVh) - vhInPixels(playerBarHeightVh); // hauteur max du canva en pixels
  const [isUpPressed, setIsUpPressed] = useState(false);
  const [isDownPressed, setIsDownPressed] = useState(false);
  const navigate = useNavigate();

  ////// MAJ DE LA POSITION DANS LE BACKEND ////////////
  const UpdateDirectionThrottled = throttle((
    socket: any,
    roomID: string,
    isUpPressed: boolean,
    isDownPressed: boolean
  ) => {
    if (isUpPressed || isDownPressed) {
      if (isUpPressed) {
        // console.log("up");
        socket?.emit("update direction", 'room_0', 2);
      } else {
        // console.log("down");
        socket?.emit("update direction", 'room_0', 1);
      }
    } else {
      // console.log("none");
      socket?.emit("update direction", 'room_0', 0);
    }
  }, 1000 / TICK_RATE);

  // Redirect if client is not logged in
  useEffect(() => {
    if (!localStorage.getItem("userToken")) {
      console.log("logged out");
      navigate("/");
    }
    else console.log("logged in");
    console.log(localStorage.getItem("userToken"));
  }, []);

  useEffect(() => {
		UpdateDirectionThrottled(socket, roomID.roomID, isUpPressed, isDownPressed);
    // Définir les gestionnaires d'événements pour les touches
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setIsDownPressed(false); // Ensure down is not pressed
        setIsUpPressed(true);
      } else if (event.key === 'ArrowDown') {
        setIsUpPressed(false); // Ensure up is not pressed
        setIsDownPressed(true);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setIsUpPressed(false);
      } else if (event.key === 'ArrowDown') {
        setIsDownPressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [socket, roomID, isUpPressed, isDownPressed]);

	useEffect(() => {
    if (roomID.roomID) socket?.emit("room infos request", roomID.roomID);
		socket?.on("room infos response", (response: Room) => {
			console.log("room infos: ", response);
      if (response) socket?.emit('start', response.name);
      else navigate('/start');
		});
		socket?.on("game data", (data: any) => {
			console.log("game data: ", data);
      player1Ref.current?.style.setProperty('top', data.paddleLeft + '%');
      player2Ref.current?.style.setProperty('top', data.paddleRight + '%');
      ballRef.current?.style.setProperty('left', data.xBall + '%');
      ballRef.current?.style.setProperty('top', data.yBall + '%');
		});
    socket?.on("game over", (winner: number) => {
      console.log("winner is : ", winner);
      navigate('/start');
    });
		return () => {
			socket?.off("room infos response");
			socket?.off("game data");
		}
	}, [socket]);

  // interface ServerResponse {
  //   player1Y: number;
  //   player2Y: number;
  // }
  // function serverUpdate(inputs: { up: boolean; down: boolean }): Promise<ServerResponse> {
  //   return new Promise((resolve) => {
  //     let newPlayer1Y = playerBar1Y;
  //     let newPlayer2Y = playerBar2Y;
      
  //     // Assuming player 1 controls are local and instant, supposed to be calculated within back?
  //     if (inputs.up) newPlayer1Y = Math.max(playerBar1Y - PLAYER_SPEED, 0);
  //     if (inputs.down) newPlayer1Y = Math.min(playerBar1Y + PLAYER_SPEED, maxY);
      
  //     resolve({
  //       player1Y: newPlayer1Y,
  //       player2Y: newPlayer2Y,
  //     });
  //   });
  // }

	return (
		<div className="Gamebackground">
			<div className="Gamepage">
				<div className="Gamecanvas">
					<div className="MiddleLine"></div>
					<div className="Player1Area" style={{ left: 0 }}>
						<div className="Playerbar1" ref={player1Ref}></div>
					</div>
					<div className="Player2Area" style={{ right: 0 }}>
						<div className="Playerbar2" ref={player2Ref}></div>
					</div>
					{<div className="main_ball" ref={ballRef}></div>}
				</div>
			</div>
		</div>
	);
}

export default Gamepage;