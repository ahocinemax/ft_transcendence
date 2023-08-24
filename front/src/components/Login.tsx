import React from 'react';
import './Login.css';

// interface LoginProps {
//   onClose: () => void;
// }

function Login() {
  return (
    <div className="Login">
      <div className="VideoContainer">
        <video autoPlay muted loop className="BackgroundVideo">
          <source src="/aurores.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="Overlay"></div>
        <div className="Connexion_popup_container">
          <div className="logins_logos">
            <a href="http://localhost:4000/auth/callback">
              <div className="fortytwo_logo"></div>
            </a>
            <a href="http://localhost:4000/auth/OAuth">
              <div className="google_logo"></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
