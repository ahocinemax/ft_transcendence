import React, { useState } from 'react';
import './Start.css';
import Login from './Login';


function Start() {
    const YourComponent = () => {
        const [showLogin, setShowLogin] = useState(false);
      
        const handleHeadingClick = () => {
          // Toggle the state value when the heading is clicked
          setShowLogin(!showLogin);
        };
  
    return (
      <div className="Start">
        <div className="container">
          <h1 className="heading" onClick={handleHeadingClick}>
            START
          </h1>
          {showLogin && <Login onClose={() => setShowLogin(false)} />}
        </div>
      </div>
    );
  }

export default Start;
