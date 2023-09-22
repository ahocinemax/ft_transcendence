import React from 'react';
import './Homepage.css';
import Sidebar from './Sidebar';

interface HomepageProps {
  onClose: () => void;
}

function Homepage() {
  return (
    <div className="Homepage">
      <div className="BackgroundImage">
        <div className="logo_42pong"></div>
      </div>
    </div>
  );
}

export default Homepage;
