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
            <a href="https://api.intra.42.fr/v2/oauth/authorize?client_id=u-s4t2ud-10cc4ddaaa36e637c3788d279bb5d12943d4d4103103ae840604d67ed61268ae&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth%2Fcallback&response_type=code">
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
