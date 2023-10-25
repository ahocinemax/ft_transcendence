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
    blocked: [],
	gamesLost: 0,
	gamesPlayed: 0,
	gamesWon: 0,
	rank: 0,
	score: 0,
	winRate: 0,
    gameHistory: []
};

// function setGameHistory = (gameHistoryList: any) => {
//     userInfoInit.gameHistory.player1 = gameHistoryList.;
// }

const initializeUser = async (result: any, setUserInfo: any) => {
    const friendList = await backFunctions.getFriend(result.name);
    const blockedList = await backFunctions.getBlockedUser(result.name);
    const gameHistoryList = await backFunctions.getGameHistory(result.id);
    userInfoInit.id = result.id;
    userInfoInit.name = result.name;
    userInfoInit.image = result.image;
    userInfoInit.friends = friendList;
    userInfoInit.blocked = blockedList;
    // setGameHistory(gameHistoryList);
    userInfoInit.gameHistory = gameHistoryList;
    userInfoInit.gamesLost = result.gamesLost;
    userInfoInit.gamesPlayed = result.gamesPlayed;
    userInfoInit.gamesWon = result.gamesWon;
    userInfoInit.rank = result.rank;
    userInfoInit.score = result.score;
    userInfoInit.winRate = result.winRate === null ? 0 : result.winRate;
    console.log("friendList", userInfoInit.friends);
    console.log("blockedList", userInfoInit.blocked);
    console.log("gameHistoryList", userInfoInit.gameHistory);
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
					await initializeUser(result, setUserInfo);
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
					<h1 className="info">{userInfo.friends[0] ? `Friend #${userInfo.friends[0].name}` : "#friends?"}</h1>
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
                <div className='friend_profile_img' style={{ backgroundImage: `url(${userInfo.friends[0] ? userInfo.friends[0].image : 'friend_profile_img'})` }}></div>
                <div className='friend_profile_name'>{userInfo.friends[0] ? userInfo.friends[0].name : 'Player2'}</div>
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
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player6</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player7</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player8</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player9</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player10</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
            <div className='friend'>
                <div className='friend_profile_img'></div>
                <div className='friend_profile_name'>Player5</div>
            </div>
        </div>
        {/* <div className='friend_profile_img' style={{ backgroundImage: `url(${userInfo.friends[0] ? userInfo.friends[0].image : 'friend_profile_img'})` }}></div> */}
                {/* <div className='friend_profile_name'>{userInfo.friends[0] ? userInfo.friends[0].name : 'Player2'}</div> */}
        <div className='match_history'>
            <div className='win'>
                <div className='match_infos'>{userInfo.gameHistory[0] ? userInfo.gameHistory[0].opponentUser.name : 'EnemyName'}</div>
                <div className='match_infos'>{userInfo.gameHistory[0] ? userInfo.gameHistory[0].ScorePlayer1 : 'MyScore'} - {userInfo.gameHistory[0] ? userInfo.gameHistory[0].ScorePlayer2 : 'EnemyScore'}</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            <div className='win'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            <div className='win'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            <div className='win'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            <div className='win'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Hard Mode</div>
                <div className='match_infos'>Win</div>
            </div>
            <div className='loose'>
                <div className='match_infos'>EnemyName</div>
                <div className='match_infos'>7 - 2</div>
                <div className='match_infos'>Normal Mode</div>
                <div className='match_infos'>Loose</div>
            </div>
            
        </div>
		</div>
	);
}

export default Profile;