import React, { useState, useEffect } from 'react';
import './Gamepage.css';

function Gamepage() {
	const [playerBar1Y, setPlayerBar1Y] = useState(150);
	const [playerBar2Y, setPlayerBar2Y] = useState(150);
	// const [ballX, setBallX] = useState(400); // Position horizontale de la balle
  	// const [ballY, setBallY] = useState(300); // Position verticale de la balle
	// const [ballSpeedX, setBallSpeedX] = useState(5); // Vitesse horizontale de la balle
	// const [ballSpeedY, setBallSpeedY] = useState(5); // Vitesse verticale de la balle

	const handleMouseMove1 = (event: any) => {
		const mouseY = event.clientY; // Obtenez la position verticale de la souris
		setPlayerBar1Y(Math.min(Math.max(mouseY - 200, 0), 535)); // Ajustez la position de la première barre du joueur
	  };
	
	  const handleMouseMove2 = (event: any) => {
		const mouseY = event.clientY; // Obtenez la position verticale de la souris
		setPlayerBar2Y(Math.min(Math.max(mouseY - 200, 0), 535)); // Ajustez la position de la deuxième barre du joueur
	  };
	
	  useEffect(() => {
		// Initialisation de la position de la balle au centre du terrain de jeu
		// setBallX(400); // Position horizontale
		// setBallY(300); // Position verticale

		// let lastTimestamp = 0;

		// // Fonction pour mettre à jour la position de la balle
		// const updateBallPosition = (timestamp) => {
		// 	if (!lastTimestamp) {
		// 		lastTimestamp = timestamp;
		// 	}
		// const deltaTime = timestamp - lastTimestamp;
		// lastTimestamp = timestamp;

		// // Calcul de la nouvelle position de la balle
		// const newBallX = ballX + ballSpeedX * (deltaTime / 1000);
		// const newBallY = ballY + ballSpeedY * (deltaTime / 1000);

		// // Mettre à jour la position de la balle
		// setBallX(newBallX);
		// setBallY(newBallY);

		// // Gérer les collisions avec les bords du terrain de jeu
		// if (newBallY <= 0 || newBallY >= 600) {
		// 	// Inverser la vitesse verticale en cas de collision avec le haut ou le bas
		// 	setBallSpeedY(-ballSpeedY);
		//   }
	  
		//   // Appeler la fonction de mise à jour à chaque frame du jeu
		//   requestAnimationFrame(updateBallPosition);
		// };

		// requestAnimationFrame(updateBallPosition);

		// Ajoutez un gestionnaire d'événements lors du montage du composant
		window.addEventListener('mousemove', handleMouseMove1);
		window.addEventListener('mousemove', handleMouseMove2);
	
		// Retirez le gestionnaire d'événements lors du démontage du composant
		return () => {
		  window.removeEventListener('mousemove', handleMouseMove1);
		  window.removeEventListener('mousemove', handleMouseMove2);
		};
	  }, [/* ballX, ballY, ballSpeedX, ballSpeedY */]);


  return (
	<div className="Gamebackground">
		<div className="Gamepage">
			<div className="Gamecanvas">
				<div className="MiddleLine"></div>
				<div className="Player1Area" style={{ left: 0 }}>
            		<div className="Playerbar1" style={{ top: playerBar1Y }}></div>
          		</div>
				<div className="Player2Area" style={{ right: 0 }}>
            		<div className="Playerbar2" style={{ top: playerBar2Y }}></div>
          		</div>
				{/* <div className="Ball" style={{ left: ballX, top: ballY }}></div> */}
			</div>
		</div>
	</div>
  );
}

export default Gamepage;