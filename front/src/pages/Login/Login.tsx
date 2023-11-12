import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function Login() {
  const googleAuthUrl = `${process.env.REACT_APP_GOOGLE_AUTH_URL}`;
  const fortytwoAuthUrl = `${process.env.REACT_APP_AUTH42_URL}`;
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userToken"))
      navigate("/profile");
  }, []);
  
  return (
    <div className="Login">
      <div className="VideoContainer">{/* 
        <video autoPlay muted loop className="BackgroundVideo">
          <source src="/aurores.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <div className="main_logo"></div>
        <div className="Overlay"></div>
        <div className="Connexion_popup_container">
          <div className="logins_logos">
            <Link className="fortytwo_logo" to={fortytwoAuthUrl}>
            </Link>
            <Link className="google_logo" to={googleAuthUrl}>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
