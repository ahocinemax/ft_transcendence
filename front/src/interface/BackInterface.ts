export interface User {
    id:             number;
    login42:        String;
    name:           String;
    email:          String;
    image:          String;
    gamesPlayed:          number;  
    gamesWon:           number; 
    status:         String;
    winRate:        Float32Array;
}