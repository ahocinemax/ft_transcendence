// eslint-disable-next-line
import React, { useContext, useState } from 'react';
import './Start.css';
// eslint-disable-next-line
import Login from '../Login/Login'
import SocketContext from '../../context/socketContext';


function Start() {
  const [showGameModes, setShowGameModes] = useState(false);
  const { socket } = useContext(SocketContext).SocketState;
  const toggleGameModes = () => {
    setShowGameModes(!showGameModes);
  };

  async function HandleStart(mode: string) {
    console.log("mode: ", mode);
    socket?.emit("register to lobby", mode);
    // run "waiting for players" animation
  }

  return (
    <div className="Start">
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
