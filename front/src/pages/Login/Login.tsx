import React from 'react';
import './Login.css';

function Login() {
  const googleAuthUrl = `${process.env.REACT_APP_GOOGLE_AUTH_URL}`;
  const fortytwoAuthUrl = `${process.env.REACT_APP_AUTH42_URL}`;
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
            <a className="fortytwo_logo" href ={fortytwoAuthUrl}>
            </a>
            <a className="google_logo" href={googleAuthUrl}>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
