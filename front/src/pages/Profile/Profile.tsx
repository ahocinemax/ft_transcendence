import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useUserContext } from '../../context/userContent';
import { userModel } from '../../interface/global';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';
import SettingsIcon from '../../PencilPixel.png';
import { userInfo } from 'os';

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

const test = () => {
    // console.log("AMIS : ", userInfoInit.friends[0].name);
}

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

    
    useEffect(() => {
        const fetchIsUser = async () => {
            let result;
            if (!isFetched && userData.userName.userName !== undefined) {
                result = await backFunctions.getUserByToken();
                if (result === undefined) return ;
                await initializeUser(result, setUserInfo);
                console.log("name:     ", userInfo.name);
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
                            <h1 className="info firstinfo"onClick={test}>{userInfo.name ? `${userInfo.name}` : "#PlayerName?"}</h1>
                            <h1 className="info">online</h1>
                            <h1 className="info">{userInfo.rank ? `Rank #${userInfo.rank}` : "#Rank?"}</h1>
                        </div>
                        <Link to="/settings" className="nav_link_profile"><img src={SettingsIcon} alt="Logo 5" /></a>
                    </div>
                </div>
                <div className="centered_div_container">
                    <div className="scores_div_main_profile">
                        <div className="scores_div_top">
                            <div className="scores_round_div"></div>
                        </div>
                        <div className="scores_div_bottom main">
                            <h1 className="info right">Games</h1>
                            <h1 className="stat main">{userInfo.gamesPlayed}</h1>
                        </div>
                    </div>
                    <div className="scores_div_main_profile">
                        <div className="scores_div_top">
                            <div className="scores_round_div"></div>
                        </div>
                        <div className="scores_div_bottom main">
                            <h1 className="info right">Wins</h1>
                            <h1 className="stat main">{userInfo.gamesWon}</h1>
                        </div>
                    </div>
                    <div className="scores_div_main_profile">
                        <div className="scores_div_top">
                            <div className="scores_round_div"></div>
                        </div>
                        <div className="scores_div_bottom main">
                            <h1 className="info right">Winrate</h1>
                            <h1 className="stat main">{userInfo.winRate ? userInfo.winRate + "%" : "X"}</h1>
                        </div>
                    </div>
                </div>
                <div className='friendlist'>
                {userInfoInit.friends.map((friend, index) => (
                    <div key={index} className='friend'>
                        <div className='friend_profile_img' style={{ backgroundImage: `url(${friend.image})` }}></div>
                        {/* <div className='friend_profile_name'>{friend.name}</div> */}
                        <Link to={`/friendProfile/${friend.name}`}>
                        <div className='friend_profile_name'>{friend.name}</div>
                        </Link>

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