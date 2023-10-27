// eslint-disable-next-line
import React, { useContext, useEffect, useState } from 'react';
import './Start.css';
// eslint-disable-next-line
import SocketContext from '../../context/socketContext';


function Start() {
  const [showGameModes, setShowGameModes] = useState(false);
  const { socket } = useContext(SocketContext).SocketState;
  const [ displayWaiting, setDisplayWaiting ] = useState(false); // should open a pupup with a waiting animation
  const [ mode, setMode ] = useState("");
  const [ textToDisplay, setTextToDisplay ] = useState("Waiting for players...");
  const [ displayClose, setDisplayClose ] = useState(true);
  const toggleGameModes = () => {
    setShowGameModes(!showGameModes);
  };

  async function HandleStart(param: string) {
    await setMode(param);
    socket?.emit("waitlist request", param);
    // run "waiting for players" animation
    setDisplayWaiting(true);
  }

  const onClose = () => {
    setDisplayWaiting(false);
    socket?.emit("leave waitlist", mode);
    setMode("");
  }

  useEffect(() => {
    socket?.on("get room id", (response: any) => {
      console.log("recieved room id: ", response);
      setDisplayClose(false);
      setTextToDisplay(`Opponent found. Joining lobby: ${response.name}`);
    });
    return () => {
      socket?.off("get room id");
    };
  }, [socket]);

  return (
    <div className="Start">
      {displayWaiting && (
      <div className="waiting_popup">
        <div className="waiting_popup_container">
          {displayClose && (<span className="popup_close" onClick={onClose}>
            &times;
          </span>)}
          <h1 className="game_mode_title">{mode}</h1>
          <h2 className="h1_popup_waiting">{textToDisplay}</h2>
        </div>
      </div>
      )}
      <h1 className="start_heading" onClick={toggleGameModes}>START</h1>
      <div className={`gamemodes_container ${showGameModes ? 'show' : ''}`}>
        <h3 className="gamemode Normal" onClick={() => HandleStart("normal")}>Normal</h3>
        <h3 className="gamemode Hard" onClick={() => HandleStart("hard")}>Hard</h3>
        <h3 className="gamemode Hardcore" onClick={() => HandleStart("hardcore")}>Hardcore</h3>
      </div>
    </div>
  );
}

export default Start;
