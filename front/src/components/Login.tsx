import React from 'react';
import './Login.css';

interface LoginProps {
    onClose: () => void; // Properly define the type of onClose prop
  }
  
function Login() {
    
  return (
    <div className="Login">
      {/* Le contenu de ton composant */}

      <div className="bg-white/80 p-5 rounded-lg flex flex-col items-center justify-center">
        <div className="test"></div>
      {/* <div className="Login-container"> */}
        <form className="Login-form">
          <label htmlFor="username">Identifiant:</label>
          <input type="text" id="username" />

          <label htmlFor="password">Mot de passe:</label>
          <input type="password" id="password" />

          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
