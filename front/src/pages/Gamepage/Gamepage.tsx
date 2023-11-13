import React, { useState, useEffect, useContext, useRef } from 'react';
import SocketContext from '../../context/socketContext';
import { useUserContext } from '../../context/userContent';
import { useNavigate } from 'react-router-dom';
import { Room } from '../../interface/BackInterface';
import { debounce, throttle } from 'lodash';
import './Gamepage.css';

function Gamepage() {
	const { socket } = useContext(SocketContext).SocketState;
	const { roomID, setRoomID } = useUserContext();
  const [localRoomID, setLocalRoomID] = useState("");
  const ballRef = useRef<HTMLDivElement | null>(null);
  const player1Ref = useRef<HTMLDivElement | null>(null);
  const player2Ref = useRef<HTMLDivElement | null>(null);
  const gameCanvasHeightVh = 68; // hauteur du Gamecanvas en vh
  const gameCanvasWidthVw = 68; // largeur du Gamecanvas en vw
  const playerBarHeightVh = 13; // hauteur de Playerbar1 en vh
  const vhInPixels = (vh: number): number => (vh * window.innerHeight) / 100; // hauteur du canva en px
  const vwInPixels = (vw: number): number => (vw * window.innerWidth) / 100; // largeur du canva en px
  const maxY = vhInPixels(gameCanvasHeightVh) - vhInPixels(playerBarHeightVh); // hauteur max du canva en pixels
  const [isUpPressed, setIsUpPressed] = useState(false);
  const [isDownPressed, setIsDownPressed] = useState(false);
  const navigate = useNavigate();
  const [gameOver, setGameOver] = useState(false);
  const [PlayerWinner, setPlayerWinner] = useState<number | null>(null);


  ////// MAJ DE LA POSITION DANS LE BACKEND ////////////
  const UpdateDirectionThrottled = throttle((
    socket: any,
    isUpPressed: boolean,
    isDownPressed: boolean
  ) => {
    if (isUpPressed || isDownPressed) {
      if (isUpPressed) {
        socket?.emit("update direction", localRoomID, 2);
      } else {
        socket?.emit("update direction", localRoomID, 1);
      }
    } else {
      socket?.emit("update direction", localRoomID, 0);
    }
  }, 100);

  useEffect(() => { if (!localStorage.getItem("userToken")) navigate("/"); }, []);

  useEffect(() => {
    console.log('localRoomID: ', localRoomID);
		UpdateDirectionThrottled(socket, isUpPressed, isDownPressed);
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
  }, [socket, roomID.roomID, isUpPressed, isDownPressed]);

	useEffect(() => {
    if (roomID.roomID) socket?.emit("room infos request", roomID.roomID);
    else navigate('/start');
		socket?.on("room infos response", (response: Room) => {
      if (response){
        console.log("received room infos:", response);
        console.log("sending start");
        socket?.emit('start', response.name);
        setLocalRoomID(response.name);
      }
      else navigate('/start');
		});
		socket?.on("game data", (data: any) => {
      console.log("received game data", data);
      player1Ref.current?.style.setProperty('top', data.paddleLeft + '%');
      player2Ref.current?.style.setProperty('top', data.paddleRight + '%');
      ballRef.current?.style.setProperty('left', data.xBall + '%');
      ballRef.current?.style.setProperty('top', data.yBall + '%');
		});
    socket?.on("game over", (winner: number) => {
      setGameOver(true);
      setPlayerWinner(winner);
      setLocalRoomID("");
      setRoomID({roomID: ""});
    });
		return () => {
			socket?.off("room infos response");
			socket?.off("game data");
      socket?.off("game over");
		}
	}, [socket]);

	return (
		<div className="Gamebackground">
			<div className="Gamepage">
                <div className="scores_container">
                    <div className="scores firstplayer">

                    </div>
                </div>
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
        {gameOver && (
        <div className="Endpopup">
          <div className="WinLoose">Player {PlayerWinner} won</div>
          <div className="GameStats">
            <div className="FinalScore">Player 1 9 - 0 Player 2</div>
          </div>
          <button className="playagain" onClick={() => navigate('/start')}>Play Again</button>
        </div>
        )}
			</div>
		</div>
	);
}

export default Gamepage;