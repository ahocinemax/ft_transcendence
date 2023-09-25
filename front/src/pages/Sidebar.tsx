import React from 'react';
import './Sidebar.css';
import PlayIcon from '../PlayIcon.png';
import LeaderboardIcon from '../LeaderboardIcon.png';
import ProfileIcon from '../ProfileIcon.png';
import ChatIcon from '../ChatIcon.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <a href="/homepage" className="nav-link"><img src={PlayIcon} alt="Logo 1" /></a>
      <a href="/leaderboard" className="nav-link"><img src={LeaderboardIcon} alt="Logo 2" /></a>
      <a href="/profile" className="nav-link"><img src={ProfileIcon} alt="Logo 3" /></a>
      <a href="/chat" className="nav-link"><img src={ChatIcon} alt="Logo 4" /></a>
    </div>
  );
}

export default Sidebar;