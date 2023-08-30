import React from 'react';
import './Profile.css'; 

const Profile = () => {
  return (
    <div className="profile">
		<div className="bande">
            <div className="profile_img"></div>
            <div className="profile_info">
                <h1 className="info">playerPseudo</h1>
                <h1 className="info">whichTeam?</h1>
                <h1 className="info">whichPosition?</h1>
                <h1 className="info">whichTeamPosition?</h1>
            </div>
        </div>
        {/* <div className="centered-div-container">
            <div className="scores_div">
                <div className="score"></div>
            </div>
        </div> */}
    </div>
  );
}

export default Profile;
