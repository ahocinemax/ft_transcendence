export interface User {
    id:             number;
    login42:        String;
    name:           String;
    email:          String;
    games:          number;  
    wins:           number; 
    status:         String;
    winRate:        Float32Array;
    achievements:   String[];
}