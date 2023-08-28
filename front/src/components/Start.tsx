import React, { useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './Start.css';
import Login from './Login'


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
  
    return (
      <div className="Start">
        <div className="container">
          <h1 className="heading" onClick={navigate_to_login}>
            START
          </h1>
          <h2 className="heading" onClick={navigate_to_homepage}>
            HOMEPAGE
          </h2>
        </div>
      </div>
    );
  }

export default Start;
