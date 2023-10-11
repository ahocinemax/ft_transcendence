import React, { useRef, useEffect } from 'react';
import './Sidebar.css';
import PlayIcon from '../../Play_Icon.png';
import LeaderboardIcon from '../../Leaderboard_Icon.png';
import ProfileIcon from '../../Profile_Icon.png';
import ChatIcon from '../../Chat_Icon.png';
import SettingsIcon from '../../Settings_Icon.png';
import LogoutIcon from '../../Exit_icon.png';

const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const scrollY = window.scrollY;
        // You can adjust the scroll speed by changing the divisor (e.g., 2).
        const newY = Math.min(0, scrollY / 2);
        if (sidebarRef.current.style) {
          sidebarRef.current.style.transform = `translateY(${newY}px)`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={sidebarRef} className="sidebar">
      <a href="/gamepage" className="nav-link"><img src={PlayIcon} alt="Logo 1" /></a>
      <a href="/leaderboard" className="nav-link"><img src={LeaderboardIcon} alt="Logo 2" /></a>
      <a href="/profile" className="nav-link"><img src={ProfileIcon} alt="Logo 3" /></a>
      <a href="/chat" className="nav-link"><img src={ChatIcon} alt="Logo 4" /></a>
      <a href="/settings" className="nav-link"><img src={SettingsIcon} alt="Logo 5" /></a>
      <a href="/logout" className="nav-link"><img src={LogoutIcon} alt="Logo 6" /></a>
    </div>
  );
}

export default Sidebar;
