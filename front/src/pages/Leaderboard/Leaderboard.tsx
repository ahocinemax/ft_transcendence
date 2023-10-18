import React from 'react';
import './Leaderboard.css'; 
import { backFunctions } from '../../outils_back/BackFunctions';
import { useEffect, useState } from 'react';

function Leaderboard() {

	// Effectuer la requête GET en utilisant l'API Fetch
	fetch('http://localhost:4000/user/getLeaderboard', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('token'),
			'Access-Control-Allow-Origin': process.env.REACT_APP_SERVER_HOST as string,
		}})
	.then((response) => {
		console.log(response);
		// Vérifier si la réponse est un succès (code 200)
		if (response.ok) {
			// Parsez la réponse JSON si nécessaire
			return response;
		} else {
			throw new Error('Échec de la requête GET');
		}
	})
	.then((data) => {
		// Traiter les données renvoyées par le serveur
		console.log(data);
	})
	.catch((error) => {
		// Gérer les erreurs potentielles
		console.error('Erreur :', error);
	});
	return (
		<div className="Login">
			<div className="VideoContainer">
				<div className="Overlay"></div>
				<div className="PersonnalLeaderboard">
					<div className="profile_picture"></div>
					<h1 className="user_pseudo">#Username</h1>
					<div className="user_stats">
						<h1 className="user_rank">#Rank</h1>
						<div className="user_info">
							<p>Parties jouées: #Parties</p>
							<p>Victoires: #Victoires</p>
							<p>100: #100</p>
						</div>
					</div>
				</div>
				<div className="leaderboard_main_div">
					<div className="rank_div_gold">
						<div className="position">
							<h1 className="h1">#1</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
					<div className="rank_div_silver">
						<div className="position">
							<h1 className="h1">#2</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
					<div className="rank_div_bronze">
						<div className="position">
							<h1 className="h1">#3</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
					<div className="rank_div">
						<div className="position">
							<h1 className="h1">#4</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudoooooo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
					<div className="rank_div">
						<div className="position">
							<h1 className="h1">#5</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
					<div className="rank_div">
						<div className="position">
							<h1 className="h1">#6</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
					<div className="rank_div">
						<div className="position">
							<h1 className="h1">#7</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
					<div className="rank_div">
						<div className="position">
							<h1 className="h1">#8</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
					<div className="rank_div">
						<div className="position">
							<h1 className="h1">#9</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
					<div className="rank_div">
						<div className="position">
							<h1 className="h1">#10</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#Pseudo</h1>
						</div>
						<div className="games_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">42</h1>
						</div>
						<div className="pseudo_div">
							<h1 className="h1">#100%</h1>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
  }

export default Leaderboard;
