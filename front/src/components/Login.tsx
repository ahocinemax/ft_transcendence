import React from 'react';
import './Login.css';

interface LoginProps {
  onClose: () => void;
}

function Login() {
  return (
    <div className="Login">
      <div className="VideoContainer">
        <video autoPlay muted loop className="BackgroundVideo">
          <source src="/aurores.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="Overlay"></div>
        <div className="Connexion_popup_container"> {/* Popup container */}
            <div className="logins_logos">                
                <div className="fortytwo_log"></div>
                <div className="google_log"></div>
            </div>
            <div className="pong_gif"></div>
        </div>
      </div>
      {/*  */}
    </div>
  );
}

export default Login;
