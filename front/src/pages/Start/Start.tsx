// eslint-disable-next-line
import React, { useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './Start.css';
// eslint-disable-next-line
import Login from '../Login/Login'


function Start() {

    const navigate = useNavigate();

    const navigate_to_login = () => {
        navigate("/login");
        return;
    }
 
    const navigate_to_homepage = () => {
      navigate("/homepage");
      return;
  }

  const navigate_to_profile = () => {
    navigate("/profile");
    return;
}
  
    return (
      <div className="Start">
        <div className="container">
          <h1 className="heading" onClick={navigate_to_login}>
            START
          </h1>
          <h1 className="heading" onClick={navigate_to_homepage}>
            HOMEPAGE
          </h1>
          <h1 className="heading" onClick={navigate_to_profile}>
            PROFIL
          </h1>
        </div>
      </div>
    );
  }

export default Start;
