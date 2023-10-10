import React, { useEffect, useState } from 'react';
import './Profile.css'; 
import { useUserContext } from '../../context/userContent';
import { userModel } from '../../interface/global';
import { useParams, useNavigate } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';

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

  export const authHeader = () => {
    let token = "Bearer " + localStorage.getItem("userToken");
    let myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    return myHeaders;
  };

  export const authContentHeader = () => {
    let token = "bearer " + localStorage.getItem("userToken");
    let myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    myHeaders.append("Content-Type", "application/json");
    return myHeaders;
  };

  export const getOtherUser = (otherUsername: number) => {
    let body = JSON.stringify({
      otherId: otherUsername,
    });
    return fetchGetOtherUser("get_user", body);
  };

  const fetchGetOtherUser = async (url: string, body: any) => {
    let fetchUrl = process.env.REACT_APP_BACKEND_URL + "/users/" + url;
    try {
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: authContentHeader(),
        body: body,
        redirect: "follow",
      });
      const result_1 = await response.json();
      if (!response.ok) return "error";
      return result_1;
    } catch (error) {
      return console.log("error", error);
    }
  };
  
const Profile = () => {
    const userData = useUserContext();
    const [userInfo, setUserInfo] = useState<userModel>(userInfoInit);
    const [isFetched, setIsFetched] = useState(false);
    const [isUser, setIsUser] = useState(true);
    let params = useParams();

    console.log("userData.nickName.nickName: ", userData.nickName);
    console.log("userData.userName.userName: ", userData.userName);
    //console.log("name:     ", userInfo.name);

    useEffect(() => {
        const fetchIsUser = async () => {
          let result;
          if (!isFetched && params.userName !== undefined) {
            result = await backFunctions.getUserByToken();
            console.log("result: ", result);
            initializeUser(result, setUserInfo);
            setIsFetched(true);
            setIsUser(false);
          }
        };
        
        const fetchLatestUserContext = async () => {
          const latestData = await backFunctions.getUserByToken();
          userData.setUserName({userName: latestData.userName});
          userData.setNickName({nickName: latestData.nickName});
          userData.setImage({image: latestData.image});
          userData.setGames({games: latestData.games});
          userData.setWins({wins: latestData.wins});
          userData.setRate({rate: latestData.rate});
        };

        fetchIsUser();
        fetchLatestUserContext();
        setIsFetched(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  return (
    <div className="profile">
		<div className="bande">
            <div className="profile_img" style={{ backgroundImage: `url(${userData?.image.image})` }}></div>
            <div className="profile_info">
                <h1 className="info">{userData?.userName.userName}</h1>
                <h1 className="info">{userData?.nickName.nickName}</h1>
                <h1 className="info">#Score?</h1>
                <h1 className="info">{userInfo.rank ? `Rank #${userInfo.rank}` : "unranked"}</h1>
            </div>
        </div>
        <div className="centered_div_container">
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Games</h1>
                    <h1 className="stat">{userData?.games.games}</h1>
                </div>
            </div>
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Wins</h1>
                    <h1 className="stat">{userData?.wins.wins}</h1>
                </div>
            </div>
            <div className="scores_div">
                <div className="scores_div_top">
                   <div className="scores_round_div"></div>
                </div>
                <div className="scores_div_bottom">
                    <h1 className="info">Winrate</h1>
                    <h1 className="stat">{userData?.rate.rate}</h1>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Profile;