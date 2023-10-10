import React from 'react';
import './Profile.css'; 
import { useState, useEffect } from 'react';
import { backFunctions } from '../../outils_back/BackFunctions';
import { User } from '../../interface/BackInterface';
import { useUserContext } from '../../context/userContent';
interface ProfileProps {
	user: User;
}
const Profile = () => {
    const [userData, setUserData] = useState<User | null>(null);
    
    useEffect(() => {
      const fetchData = async () => {
        const user = await backFunctions.getUserByToken();//your name~
        setUserData(user);
      };
      fetchData();
    }, []);
    const { userName, nickName, game, image, } = useUserContext()
    console.log("TEST", useUserContext());
    return (     
        <div className="profile">
		<div className="bande">
            <div className="profile_img" style={{ backgroundImage: `url(${image.image})` }}></div>
            <div className="profile_info">
                <h1 className="info">playerPseudo</h1>
                <h1 className="info">{userName.userName}</h1>
                <h1 className="info">whichPosition?</h1>
                <h1 className="info">whichTeamPosition?</h1>
            </div>
        </div>
        <div className="centered_div_container">
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Games</h1>
                    <h1 className="stat">{game.game}</h1>
                </div>
            </div>
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Wins</h1>
                    <h1 className="stat">{userData?.wins}</h1>
                </div>
            </div>
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Winrate</h1>
                    <h1 className="stat">{userData?.winRate}</h1>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Profile;