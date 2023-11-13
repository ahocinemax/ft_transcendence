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
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1img, setPlayer1img] = useState('');
  const [player2img, setPlayer2img] = useState('');
  const [player1Score, setplayer1Score] = useState('');
  const [player2Score, setplayer2Score] = useState('');
  const [PlayerWinner, setPlayerWinner] = useState<number | null>(null);
  const [PlayerLooser, setPlayerLooser] = useState<number | null>(null);
  const [WinnerScore, setWinnerScore] = useState<number | null>(null);
  const [LooserScore, setLooserScore] = useState<number | null>(null);
  const [WinnerName, setWinnerName] = useState<string | null>(null);
  const [LooserName, setLooserName] = useState<string | null>(null);



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
        setPlayer1(response.NamePlayer1);
        setPlayer2(response.NamePlayer2);
        setPlayer1img(response.AvatarPlayer1);
        setPlayer2img(response.AvatarPlayer2);
      }
      else navigate('/start');
		});
		socket?.on("game data", (data: any) => {
      console.log("received game data", data);
      player1Ref.current?.style.setProperty('top', data.paddleLeft + '%');
      player2Ref.current?.style.setProperty('top', data.paddleRight + '%');
      ballRef.current?.style.setProperty('left', data.xBall + '%');
      ballRef.current?.style.setProperty('top', data.yBall + '%');
      setplayer1Score(data.player1Score);
      setplayer2Score(data.player2Score);
		});
    socket?.on("game over", ({ winner, room }: { winner: number, room: Room }) => {
      setGameOver(true);
      setPlayerWinner(winner);
      setLocalRoomID("");
      setRoomID({roomID: ""});
      winner == 1 ? setPlayerLooser(2) : setPlayerLooser(1);
      winner == 1 ? setWinnerScore(room.ScorePlayer1) : setWinnerScore(room.ScorePlayer2);
      winner == 1 ? setLooserScore(room.ScorePlayer2) : setLooserScore(room.ScorePlayer1);
      winner == 1 ? setWinnerName(room.NamePlayer1) : setWinnerName(room.NamePlayer2);
      winner == 1 ? setLooserName(room.NamePlayer2) : setLooserName(room.NamePlayer1);
      console.log("P1 NAME: ", room.NamePlayer1);
      console.log("P2 NAME: ", room.NamePlayer2);
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
              <div className="player_details player1_details">
                <div 
                  className="player_image" 
                  style={{ backgroundImage: `url(${player1img})` }}
                />
                <div className="player_name leftside">{player1}</div>
                <div className="player_score leftside">{player1Score}</div>
              </div>
              <div className="player_details player2_details">
                <div className="player_score rightside">{player2Score}</div>
                <div className="player_name rightside">{player2}</div>
                <div 
                  className="player_image" 
                  style={{ backgroundImage: `url(${player2img})` }}
                />
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
              <div className="main_ball" ref={ballRef}></div>
            </div>
      
            {gameOver && (
              <div className="Endpopup">
                <div className="WinLoose">{WinnerName} won</div>
                <div className="GameStats">
                  <div className="FinalScore">{WinnerName} {WinnerScore} - {LooserScore} {LooserName}</div>
                </div>
                <button className="playagain" onClick={() => navigate('/start')}>Play Again</button>
              </div>
            )}
          </div>
        </div>
      );      
}

export default Gamepage;