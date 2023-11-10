    import React from 'react';
    import './Leaderboard.css'; 
    import { backFunctions } from '../../outils_back/BackFunctions';
    import { useEffect, useState } from 'react';
    import { useUserContext } from '../../context/userContent';
    import { useNavigate } from 'react-router-dom';
  interface User {
  	id: number;
  	name: string;
  	rank: number;
  	winRate: number;
  	gamesPlayed: number;
  	gamesWon: number;
  	gamesLost: number;
  }

  async function getUserByToken() {
	  	const response = await backFunctions.getUserByToken();
  	return response;			
  }


  function Leaderboard() {
  	const [leaderboardData, setLeaderboardData] = useState<User[] | null>(null);
	  const {
		userName,
		setUserName,
		image,
		setImage,
		rank,
		setRank,
		wins,
		setWins,
		rate,
		setRate,
		play,
		setPlay,
		score,
		setScore,
	  } = useUserContext();

      

    const navigate = useNavigate();
      
    useEffect(() => {
      if (!localStorage.getItem("userToken")) {
        console.log("logged out");
        navigate("/");
      }
      else console.log("logged in");
      console.log(localStorage.getItem("userToken"));
    }, []);

  	useEffect(() => {
  	  fetch('http://localhost:4000/user/getLeaderboard', {
  		method: 'GET',
  		headers: {
  		  'Content-Type': 'application/json',
  		  'Authorization': 'Bearer ' + localStorage.getItem('token'),
  		  'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER_HOST as string,
  		}
  	  })
  	  .then(response => response.json())  // changer la response comme JSON
  	  .then((data: User[]) => {
  		setLeaderboardData(data);  // 状態を更新
  	  })
  	  .catch(error => {
  		console.error('Error:', error);
  	  });
  	}, []);  // 空の依存配列を渡して、コンポーネントがマウントされたときに一度だけ実行する
  	return (
  		<div className="Login">
  		  <div className="VideoContainer">
  			<div className="Overlay"></div>
				<div className="PersonnalLeaderboard">
					<div className="profile_picture" style={{ backgroundImage: `url(${image.image})` }}></div>
   					<h1 className="user_pseudo">{userName.userName}</h1>
   					<div className="user_stats">
   						<h1 className="user_rank">Rank #{rank.rank}</h1>
   						<div className="user_info">
   							{/* <p>PlayTime: {play.play}</p> */}
							<p>Score: {score.score}</p>
   							<p>Victoires: {wins.wins}</p>
   							<p>WinRate: {rate.rate} %</p>
							{/* <p>(↑PlayTime + score: example d'affichage. vous pouvez changer!)</p> */}
   						</div>
   					</div>
  			</div>
  			<div className="leaderboard_main_div">
  			  {leaderboardData ? leaderboardData.map((user: User, index: number) => (
  				<div className={`rank_div ${index === 0 ? 'rank_div_gold' : index === 1 ? 'rank_div_silver' : index === 2 ? 'rank_div_bronze' : ''}`} key={index}>
  				  <div className="position">
  					<h1 className="h1 leaderboard">#{index + 1}</h1>
  				  </div>
  				  <div className="pseudo_div">
  					<h1 className="h1 leaderboard">{user.name}</h1>
  				  </div>
  				  <div className="games_div">
  					<h1 className="h1 leaderboard">Games: {user.gamesPlayed}</h1>
  				  </div>
  				  <div className="pseudo_div">
  					<h1 className="h1 leaderboard">Wins: {user.gamesWon}</h1>
  				  </div>
  				  <div className="pseudo_div">
  					<h1 className="h1 leaderboard">Ratio: {user.winRate}%</h1>
  				  </div>
  				</div>
  			  )) : 'Loading...'}
  			</div>
  		  </div>
  		</div>
  	  );
 			  }
  	export default Leaderboard;