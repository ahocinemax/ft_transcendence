//  /*version ahocine */
//   import './Leaderboard.css'; 
//   import React from 'react';
//   import { backFunctions } from '../../outils_back/BackFunctions';
//   import { useEffect, useState } from 'react';

//   function Leaderboard() {
//  	// Effectuer la requête GET en utilisant l'API Fetch
//  	fetch('http://localhost:4000/user/getLeaderboard', {
//  		method: 'GET',
//  		headers: {
//  			'Content-Type': 'application/json',
//  			'Authorization': 'Bearer ' + localStorage.getItem('token'),
//  			'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER_HOST as string,
//  		}})
//  	.then((response) => {
//  		console.log(response);
//  		// Vérifier si la réponse est un succès (code 200)
//  		if (response.ok) {
//  			// Parsez la réponse JSON si nécessaire
//  			return response;
//  		} else {
//  			throw new Error('Échec de la requête GET');
//  		}
//  	})
//  	.then((data) => {
//  		// Traiter les données renvoyées par le serveur
//  		console.log(data);
//  	})
//  	.catch((error) => {
//  		// Gérer les erreurs potentielles
//  		console.error('Erreur :', error);
//  	});
//   	return (
//   		<div className="Login">
//   			<div className="VideoContainer">
//   				<div className="Overlay"></div>
//   				<div className="PersonnalLeaderboard">
//   					<div className="profile_picture"></div>
//   					<h1 className="user_pseudo">#Username</h1>
//   					<div className="user_stats">
//   						<h1 className="user_rank">#Rank</h1>
//   						<div className="user_info">
//   							<p>Parties jouées: #Parties</p>
//   							<p>Victoires: #Victoires</p>
//   							<p>100: #100</p>
//   						</div>
//   					</div>
//   				</div>
//   				<div className="leaderboard_main_div">
//   					<div className="rank_div_gold">
//   						<div className="position">
//   							<h1 className="h1">#1</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   					<div className="rank_div_silver">
//   						<div className="position">
//   							<h1 className="h1">#2</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   					<div className="rank_div_bronze">
//   						<div className="position">
//   							<h1 className="h1">#3</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   					<div className="rank_div">
//   						<div className="position">
//   							<h1 className="h1">#4</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudoooooo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   					<div className="rank_div">
//   						<div className="position">
//   							<h1 className="h1">#5</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   					<div className="rank_div">
//   						<div className="position">
//   							<h1 className="h1">#6</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   					<div className="rank_div">
//   						<div className="position">
//   							<h1 className="h1">#7</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   					<div className="rank_div">
//   						<div className="position">
//   							<h1 className="h1">#8</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   					<div className="rank_div">
//   						<div className="position">
//   							<h1 className="h1">#9</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   					<div className="rank_div">
//   						<div className="position">
//   							<h1 className="h1">#10</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#Pseudo</h1>
//   						</div>
//   						<div className="games_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">42</h1>
//   						</div>
//   						<div className="pseudo_div">
//   							<h1 className="h1">#100%</h1>
//   						</div>
//   					</div>
//   				</div>
//   			</div>
//   		</div>
//   	);
//  	}
//   export default Leaderboard;


  import React from 'react';
  import './Leaderboard.css'; 
  import { backFunctions } from '../../outils_back/BackFunctions';
  import { useEffect, useState } from 'react';
  import { useUserContext } from '../../context/userContent';
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
   						<h1 className="user_rank">Rank: {rank.rank}</h1>
   						<div className="user_info">
   							<p>PlayTime: {play.play}</p>
							<p>Score: {score.score}</p>
   							<p>Victoires: {wins.wins}</p>
   							<p>WinRate: {rate.rate * 100}</p>
							<p>(↑PlayTime + score: example d'affichage. vous pouvez changer!)</p>
   						</div>
   					</div>
  			</div>
  			<div className="leaderboard_main_div">
  			  {leaderboardData ? leaderboardData.map((user: User, index: number) => (
  				<div className={`rank_div ${index === 0 ? 'rank_div_gold' : index === 1 ? 'rank_div_silver' : index === 2 ? 'rank_div_bronze' : ''}`} key={index}>
  				  <div className="position">
  					<h1 className="h1">#{index + 1}</h1>
  				  </div>
  				  <div className="pseudo_div">
  					<h1 className="h1">{user.name}</h1>
  				  </div>
  				  <div className="games_div">
  					<h1 className="h1">{user.gamesPlayed}</h1>
  				  </div>
  				  <div className="pseudo_div">
  					<h1 className="h1">{user.gamesWon}</h1>
  				  </div>
  				  <div className="pseudo_div">
  					<h1 className="h1">{user.winRate * 100}%</h1>
  				  </div>
  				</div>
  			  )) : 'Loading...'}
  			</div>
  		  </div>
  		</div>
  	  );
 			  }
  	export default Leaderboard;