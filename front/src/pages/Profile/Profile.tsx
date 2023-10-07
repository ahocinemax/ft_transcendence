import React from 'react';
import './Profile.css'; 

const Profile = () => {
  return (
    <div className="profile">
		<div className="bande">
            <div className="profile_img"></div>
            <div className="profile_info">
                <h1 className="info">#playerPseudo</h1>
                <h1 className="info">#whichTeam?</h1>
                <h1 className="info">#Score?</h1>
                <h1 className="info">#Rank?</h1>
            </div>
        </div>
        <div className="centered_div_container">
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Games</h1>
                    <h1 className="stat">42</h1>
                </div>
            </div>
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Wins</h1>
                    <h1 className="stat">42</h1>
                </div>
            </div>
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Winrate</h1>
                    <h1 className="stat">100%</h1>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Profile;
