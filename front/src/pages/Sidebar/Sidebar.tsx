import React, { useRef, useEffect } from 'react';
import './Sidebar.css';
import PlayIcon from '../../Play_Icon.png';
import LeaderboardIcon from '../../Leaderboard_Icon.png';
import ProfileIcon from '../../Profile_Icon.png';
import ChatIcon from '../../Chat_Icon.png';
import SettingsIcon from '../../Settings_Icon.png';
import LogoutIcon from '../../Exit_icon.png';
import { useNavigate, Link } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';
import { useUserContext } from '../../context/userContent';

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

  const navigate = useNavigate();
  const {userName} = useUserContext();
  const handleLogout = async () => {
    let user = {otp_validated: false};
    try {
      await backFunctions.logout();
      console.log('Logout successful');
      const response = await backFunctions.updateUser(userName.userName, user);
      if (response.statusCode === 400) console.error(response.error);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div ref={sidebarRef} className="sidebar">
      <Link to="/start" className="nav-link"><img src={PlayIcon} alt="Logo 1" /></Link>
      <Link to="/leaderboard" className="nav-link"><img src={LeaderboardIcon} alt="Logo 2" /></Link>
      <Link to="/profile" className="nav-link"><img src={ProfileIcon} alt="Logo 3" /></Link>
      <Link to="/chat" className="nav-link"><img src={ChatIcon} alt="Logo 4" /></Link>
      <Link to="/settings" className="nav-link"><img src={SettingsIcon} alt="Logo 5" /></Link>
      <span onClick={handleLogout} className="nav-link"><img src={LogoutIcon} alt="Logo 6" /></span>
    </div>
  );
}

export default Sidebar;
