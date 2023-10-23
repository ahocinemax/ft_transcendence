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

const friends = [
    { name: 'Player1', profile_img: require('../../avatar.png')},
    { name: 'Player2', profile_img: require('../../avatar.png')},
    { name: 'Player3', profile_img: require('../../avatar.png')},
    { name: 'Player4', profile_img: require('../../avatar.png')},
    { name: 'Player5', profile_img: require('../../avatar.png')},
    { name: 'Player6', profile_img: require('../../avatar.png')},
    { name: 'Player7', profile_img: require('../../avatar.png')},
    { name: 'Player8', profile_img: require('../../avatar.png')},
    { name: 'Player9', profile_img: require('../../avatar.png')},
    { name: 'Player10', profile_img: require('../../avatar.png')},
    { name: 'Player11', profile_img: require('../../avatar.png')},
    { name: 'Player12', profile_img: require('../../avatar.png')},
    { name: 'Player13', profile_img: require('../../avatar.png')},
    { name: 'Player14', profile_img: require('../../avatar.png')}
      ];

const match_history = [
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'Loose' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'Win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'Loose' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'Loose' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'Loose' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
    { opponentName: 'EnemyName', score: '7 - 2', mode: 'Hard Mode', result: 'win' },
            ];

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
                    <div className="info_container">
					    <h1 className="info firstinfo">{userInfo.name ? `${userInfo.name}` : "#PlayerName?"}</h1>
					    <h1 className="info">online</h1>
					    <h1 className="info">{userInfo.rank ? `Rank #${userInfo.rank}` : "#Rank?"}</h1>
                    </div>
                    <a href="/settings" className="nav_link_profile"><img src={SettingsIcon} alt="Logo 5" /></a>
				</div>
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
						<h1 className="stat">{userInfo.winRate ? userInfo.winRate + "%" : "X"}</h1>
					</div>
				</div>
			</div>
            <div className='friendlist'>
                {friends.map((friend, index) => (
                  <div key={index} className='friend'>
                    <div className='friend_profile_img' style={{ backgroundImage: `url(${friend.profile_img})` }}></div>
                    <div className='friend_profile_name'>{friend.name}</div>
                  </div>
                ))}
            </div>
            <div className='match_history'>
                {match_history.map((match, index) => (
                  <div key={index} className={match.result}>
                    <div className='match_infos'>{match.opponentName}</div>
                    <div className='match_infos'>{match.score}</div>
                    <div className='match_infos'>{match.mode}</div>
                    <div className='match_infos'>{match.result.charAt(0).toUpperCase() + match.result.slice(1)}</div>
                  </div>
                ))}
                </div>
        </div>
	);
}

export default Profile;