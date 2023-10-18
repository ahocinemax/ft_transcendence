import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useUserContext } from '../../context/userContent';
import { userModel } from '../../interface/global';
import { useParams, useNavigate } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';
import SettingsIcon from '../../Settings_Icon.png';

const userInfoInit: userModel = {
	id: 0,
	name: "",
	image: "",
	friends: [],
	gamesLost: 0,
	gamesPlayed: 0,
	gamesWon: 0,
	rank: 0,
	score: 0,
	winRate: 0,
};
	
	const initializeUser = (result: any, setUserInfo: any) => {
		userInfoInit.id = result.id;
		userInfoInit.name = result.name;
		userInfoInit.image = result.image;
		userInfoInit.friends = result.frirends;
		userInfoInit.gamesLost = result.gamesLost;
		userInfoInit.gamesPlayed = result.gamesPlayed;
		userInfoInit.gamesWon = result.gamesWon;
		userInfoInit.rank = result.rank;
		userInfoInit.score = result.score;
		userInfoInit.winRate = result.winRate === null ? 0 : result.winRate;
		setUserInfo(userInfoInit);
	};

const Profile = () => {
	const [isUserDataUpdated, setIsUserDataUpdated] = useState(false);
    const userData = useUserContext();
    const [userInfo, setUserInfo] = useState<userModel>(userInfoInit);
    const [isFetched, setIsFetched] = useState(false);
    const [isUser, setIsUser] = useState(true);
    let params = useParams();

    //console.log("name:     ", userInfo.name);

		useEffect(() => {
			const fetchIsUser = async () => {
				let result;
				if (!isFetched && userData.userName.userName !== undefined) {
					result = await backFunctions.getUserByToken();
					if (result === undefined) return ;
					initializeUser(result, setUserInfo);
					setIsFetched(true);
					setIsUser(false);
					setIsUserDataUpdated(false);
				}
			};
			fetchIsUser();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isFetched, userData, isUserDataUpdated]);

		return (
		<div className="profile">
			<div className="bande">
			<div className="profile_img" style={{ backgroundImage: `url(${userInfo.image})` }}></div>
				<div className="profile_info">
					<h1 className="info">{userInfo.name ? `${userInfo.name}` : "#PlayerName?"}</h1>
					<h1 className="info">#whichTeam?</h1>
					<h1 className="info">{userInfo.score ? `${userInfo.score}` : "#Score?"}</h1>
					<h1 className="info">{userInfo.rank ? `Rank #${userInfo.rank}` : "#Rank?"}</h1>
				</div>
            <a href="/settings" className="nav-link_profile"><img src={SettingsIcon} alt="Logo 5" /></a>
			</div>
			<div className="centered_div_container">
				<div className="scores_div">
					<div className="scores_div_top">
						<div className="scores_round_div"></div>
					</div>
					<div className="scores_div_bottom">
						<h1 className="info">Games</h1>
						<h1 className="stat">{userInfo.gamesPlayed}</h1>
					</div>
				</div>
				<div className="scores_div">
					<div className="scores_div_top">
						<div className="scores_round_div"></div>
					</div>
					<div className="scores_div_bottom">
						<h1 className="info">Wins</h1>
						<h1 className="stat">{userInfo.gamesWon}</h1>
					</div>
				</div>
				<div className="scores_div">
					<div className="scores_div_top">
						<div className="scores_round_div"></div>
					</div>
					<div className="scores_div_bottom">
						<h1 className="info">Winrate</h1>
						<h1 className="stat">{userInfo.winRate ? userInfo.winRate + "%" : "(none)"}</h1>
					</div>
				</div>
			</div>
        <div className='friendlist'>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player2</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player3</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player4</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
        </div>
		</div>
	);
}

export default Profile;