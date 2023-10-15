import React, { useState } from 'react';
import './Start.css';

function Start() {
  const [showGameModes, setShowGameModes] = useState(false);

  const toggleGameModes = () => {
    setShowGameModes(!showGameModes);
  };

  return (
    <div className="Start">
      <h1 className="start_heading" onClick={toggleGameModes}>
        START
      </h1>
      <div className={`gamemodes_container ${showGameModes ? 'show' : ''}`}>
        <h3 className="gamemode Normal">Normal</h3>
        <h3 className="gamemode Hard">Hard</h3>
        <h3 className="gamemode Hardcore">Hardcore</h3>
      </div>
    </div>
  );
}

export default Start;
