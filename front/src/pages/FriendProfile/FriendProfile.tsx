import React, { useEffect, useState } from 'react';
import './FriendProfile.css';
import { useUserContext } from '../../context/userContent';
import { userModel } from '../../interface/global';
import { useParams, useNavigate, Link} from 'react-router-dom';
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
		// console.log("friendList", userInfoInit.friends);
		// console.log("blockedList", userInfoInit.blocked);
		// console.log("gameHistoryList", userInfoInit.gameHistory);
	};

const FriendProfile = () => {
	const [isUserDataUpdated, setIsUserDataUpdated] = useState(false);
    const userData = useUserContext();
    const [userInfo, setUserInfo] = useState<userModel>(userInfoInit);
    const [isFetched, setIsFetched] = useState(false);
    const [isUser, setIsUser] = useState(true);
	const [myFriendList, setMyFriendList] = useState<userModel[]>([]);
	const [myBlockedList, setMyBlockedList] = useState<userModel[]>([]);
	const isUserFriend = userInfo.friends.some((friend) => friend.name === userData.userName.userName);
    //let params = useParams();

    //console.log("name:     ", userInfo.name);

    const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userToken")) {
      console.log("logged out");
      navigate("/");
    }
    else console.log("logged in");
    console.log(localStorage.getItem("userToken"));
  }, []);

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

		useEffect(() => {
			// Fonction asynchrone pour récupérer la liste d'amis
			const fetchFriends = async () => {
			  try {
				const name = userData.userName.userName; // Remplacez par le nom de l'utilisateur que vous souhaitez obtenir
				const data = await backFunctions.getFriend(name); // Appel de la fonction pour obtenir la liste d'amis
				// const data = await response.json(); // Extraction des données de la réponse
		
				// Vérifiez si la réponse a réussi et que les données sont au format attendu
				if (/* response.ok &&  */Array.isArray(data))
				  setMyFriendList(data); // Mettez à jour l'état avec la liste d'amis
				else
				  console.error('La requête a échoué ou les données ne sont pas au format attendu.');
				}
			  catch (error) {
				console.error('Une erreur s\'est produite lors de la récupération de la liste d\'amis.', error);
			}
		}
		fetchFriends();
			}, []);

		useEffect(() => {
			// Fonction asynchrone pour récupérer la liste d'amis
			const fetchBlocked = async () => {
			  try {
				const name = userData.userName.userName; // Remplacez par le nom de l'utilisateur que vous souhaitez obtenir
				const data = await backFunctions.getBlockedUser(name); // Appel de la fonction pour obtenir la liste d'amis
				// const data = await response.json(); // Extraction des données de la réponse
		
				// Vérifiez si la réponse a réussi et que les données sont au format attendu
				if (/* response.ok &&  */Array.isArray(data))
				  setMyBlockedList(data); // Mettez à jour l'état avec la liste d'amis
				else
				  console.error('La requête a échoué ou les données ne sont pas au format attendu.');
				}
			  catch (error) {
				console.error('Une erreur s\'est produite lors de la récupération de la liste d\'amis.', error);
			}
		}
		fetchBlocked();
			}, []);

        
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
						{myFriendList.some((friend) => userInfo.id === friend.id) ? (
								<div className="remove_friend_button" onClick={() => {backFunctions.removeFriend(userData.userName.userName, userInfo.name)}} ></div>
							) : (
								<div className="add_friend_button" onClick={() => backFunctions.addFriend(userData.userName.userName, userInfo.name, userInfo)} ></div>
						)}
						{myBlockedList.some((blocked) => userInfo.id === blocked.id) ? (
								<div className="unblock_button" onClick={() => backFunctions.removeBlock(userData.userName.userName, userInfo.name)} ></div>
							) : (
								<div className="block_button" onClick={() => backFunctions.blockUser(userData.userName.userName, userInfo.name, userInfo)} ></div>
						)}
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