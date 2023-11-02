import React, { useEffect, useState } from 'react';
import './FriendProfile.css';
import { useUserContext } from '../../context/userContent';
import { userModel } from '../../interface/global';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';
import SettingsIcon from '../../Settings_Icon.png';
import BlockIcon from '../../BlockUserPixel.png';
import AddIcon from '../../AddUserPixel.png';


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

	const initializeUser = async  (result: any, setUserInfo: any) => {
		const friendList = await backFunctions.getFriend(result.name);
		const blockedList = await backFunctions.getBlockedUser(result.name);
		const gameHistoryList = await backFunctions.getGameHistory(result.id);

		const newUserInfo = {
			...userInfoInit,
			id: result.id,
			name: result.name,
			image: result.image,
			friends: friendList,
			blocked: blockedList,
			gameHistory: gameHistoryList,
			gamesLost: result.gamesLost,
			gamesPlayed: result.gamesPlayed,
			gamesWon: result.gamesWon,
			rank: result.rank,
			score: result.score,
			winRate: result.winRate === null ? 0 : result.winRate,
		};
		setUserInfo(newUserInfo);
		console.log("friendList", newUserInfo.friends);
		console.log("blockedList", newUserInfo.blocked);
		console.log("gameHistoryList", newUserInfo.gameHistory);
	};

const FriendProfile = () => {
	const [isUserDataUpdated, setIsUserDataUpdated] = useState(false);
    const userData = useUserContext();
    const [userInfo, setUserInfo] = useState<userModel>(userInfoInit);
    const [isFetched, setIsFetched] = useState(false);
	const [selectedUser, setSelectedUser] = useState('');
    const [isUser, setIsUser] = useState(true);
    //let params = useParams();

    //console.log("name:     ", userInfo.name);

	let params =  useParams<{ friendName: string }>();
	let friendName = params.friendName;
		useEffect(() => {
			const fetchFriendData = async () => {
				let result;
				if (!isFetched && friendName !== undefined) {
					result = await backFunctions.getUserByName(friendName);
					if (result === undefined) return ;
					console.log("getUserByName", result);
					initializeUser(result, setUserInfo);
					setIsFetched(true);
					setIsUserDataUpdated(false);
				}
			};
			fetchFriendData();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [isFetched, userData, isUserDataUpdated]);

        useEffect(() => {
            const fetchFriendData = async () => {
                if (friendName) {
                    const result = await backFunctions.getUserByName(friendName);
                    if (result) {
                        console.log("getUserByName", result);
                        await initializeUser(result, setUserInfo);
                    }
                }
            };
            fetchFriendData();
        }, [friendName]);
        
		return (
		<div className="profile">
			<div className="bande">
			<div className="profile_img" style={{ backgroundImage: `url(${userInfo.image})` }}></div>
				<div className="profile_info">
						<div className="info_container">
							<h1 className="info firstinfo">{userInfo.name ? `${userInfo.name}` : "#PlayerName?"}</h1>
							<h1 className="info">online/offline</h1>
							<h1 className="info">{userInfo.rank ? `Rank #${userInfo.rank}` : "#Rank?"}</h1>
						</div>
							<div className="add_friend_button" onClick={() => backFunctions.addFriend(userData.userName.userName, userInfo.name, userInfo)} ></div>
							<div className="block_friend_button" onClick={() => backFunctions.blockUser(userData.userName.userName, userInfo.name, userInfo)} ></div>
				</div>
			</div>
			<div className="centered_div_container">
				<div className="scores_div_main_profile">
					<div className="scores_div_top">
						<div className="scores_round_div"></div>
					</div>
					<div className="scores_div_bottom">
						<h1 className="info right">Games</h1>
						<h1 className="stat main">{userInfo.gamesPlayed}</h1>
					</div>
				</div>
				<div className="scores_div_main_profile">
					<div className="scores_div_top">
						<div className="scores_round_div"></div>
					</div>
					<div className="scores_div_bottom">
						<h1 className="info right">Wins</h1>
						<h1 className="stat main">{userInfo.gamesWon}</h1>
					</div>
				</div>
				<div className="scores_div_main_profile">
					<div className="scores_div_top">
						<div className="scores_round_div"></div>
					</div>
					<div className="scores_div_bottom">
						<h1 className="info right">Winrate</h1>
						<h1 className="stat main">{userInfo.winRate ? userInfo.winRate + "%" : "X"}</h1>
					</div>
				</div>
			</div>
            <div className='friendlist'>
                {userInfo.friends.map((friend, index) => (
                  <div key={index} className='friend'>
                    <div className='friend_profile_img' style={{ backgroundImage: `url(${friend.image})` }}></div>
                    <Link to={`/profile/${friend.name}`}>
                      <div className='friend_profile_name'>{friend.name}</div>
                    </Link>
                  </div>
                ))}
            </div>
                <div className='match_history main'>
                {userInfo.gameHistory && userInfo.gameHistory.map((match, index) => (
                    <div key={index} className={match.victory ? "win" : "loose"}>
                    <div className='match_infos'>{userInfo.name}</div>
                    <div className='match_infos'>{match.userScore} - </div>
                    <div className='match_infos'>{match.opponentScore}</div>
                    <div className='match_infos'>{match.opponentUser.name}</div>
                    <div className='match_infos'>{match.mode}</div>
                  </div>
                ))}
                </div>
            </div>
	);
}

export default FriendProfile;