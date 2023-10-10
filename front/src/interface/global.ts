export interface userModel {
    id: number;
    name: string;
    image: string;
    friends: Array<userModel>;
    gamesLost: number;
    gamesPlayed: number;
    gamesWon: number;
    rank: number;
    score: number;
    winRate: number;
}