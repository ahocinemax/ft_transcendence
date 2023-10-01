import React from 'react';
import './Login.css';

interface LoginProps {
  onClose: () => void;
}

function Login() {
  const googleAuthUrl = process.env.REACT_APP_GOOGLE_AUTH_URL;
  const fortytwoAuthUrl = process.env.REACT_APP_AUTH42_URL;
  return (
    <div className="Login">
      <div className="VideoContainer">{/* 
        <video autoPlay muted loop className="BackgroundVideo">
          <source src="/aurores.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <div className="Overlay"></div>
        <div className="Connexion_popup_container">
          <div className="logins_logos">
            <a href={fortytwoAuthUrl}>
              <div className="fortytwo_logo"></div>
            </a>
            <a href={googleAuthUrl}>
             <div className="google_logo"></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
