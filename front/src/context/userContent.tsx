import {createContext, useContext, useEffect, useState} from 'react';
import React from 'react';
import getUserInfo from '../outils_back/GetUserInfo';
import { useNavigate } from 'react-router-dom';

type UserContextProviderProps = {
	children: React.ReactNode;
};

export type DoubleAuthVerified = {
	verified2FA: boolean;
};

export type DoubleAuth = {
	doubleAuth: boolean;
};

export type UserName = {
	userName: string;
};

export type AuthImage = {
	image: string;
};

export type Email = {
	email: string;
};

export type Lost = {
	lost: number;
};

export type Rate = {
	rate: number;
}

export type Wins = {
	wins: number;
}

export type Rank = {
	rank: number;
}

export type Play = {
	play: number;
}

export type Score = {
	score: number;
}

export type RoomID = {
	roomID: string;
};

type UserContextType = {
	userName: UserName;
	setUserName: React.Dispatch<React.SetStateAction<UserName>>;
	image: AuthImage;
	setImage: React.Dispatch<React.SetStateAction<AuthImage>>;
	doubleAuth: DoubleAuth;
	setDoubleAuth: React.Dispatch<React.SetStateAction<DoubleAuth>>;
	verified2FA: DoubleAuthVerified;
	setVerified2FA: React.Dispatch<React.SetStateAction<DoubleAuthVerified>>;
	email: Email;
	setEmail: React.Dispatch<React.SetStateAction<Email>>;
	lost: Lost;
	setLost: React.Dispatch<React.SetStateAction<Lost>>;
	wins: Wins;
	setWins: React.Dispatch<React.SetStateAction<Wins>>;
	rate: Rate;
	setRate: React.Dispatch<React.SetStateAction<Rate>>;
	rank: Rank;
	setRank: React.Dispatch<React.SetStateAction<Rank>>;
	play: Play;
	setPlay: React.Dispatch<React.SetStateAction<Play>>;
	score: Score;
	setScore: React.Dispatch<React.SetStateAction<Score>>;
	roomID: RoomID;
	setRoomID: React.Dispatch<React.SetStateAction<RoomID>>;
};

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({children}: UserContextProviderProps) => {
	const navigate = useNavigate();
	const [userName, setUserName] = useState<UserName>({userName: ''});
	const [image, setImage] = useState<AuthImage>({image: ''});
	const [doubleAuth, setDoubleAuth] = useState<DoubleAuth>({doubleAuth: false});
	const [verified2FA, setVerified2FA] = useState<DoubleAuthVerified>({verified2FA: false});
	const [email, setEmail] = useState<Email>({email: ''});
	const [lost, setLost] = useState<Lost>({lost: 0});
	const [wins, setWins] = useState<Wins>({wins: 0});
	const [rate, setRate] = useState<Rate>({rate: 0});
	const [rank, setRank] = useState<Rank>({rank: 0});
	const [play, setPlay] = useState<Play>({play: 0});
	const [score, setScore] = useState<Score>({score: 0});
	const [roomID, setRoomID] = useState<RoomID>({roomID: ''});

	useEffect(() => {
		const userInfos = getUserInfo(navigate);
		userInfos.then((rhs) => {
			if (rhs == null) return ;
			setUserName({userName: rhs.name});
			setImage({image: rhs.image});
			setDoubleAuth({doubleAuth: rhs.otp_enabled});
			setVerified2FA({verified2FA: rhs.otp_validated});
			setEmail({email: rhs.email});
			setLost({lost: rhs.gamesLost});
			setWins({wins: rhs.gamesWon});
			setRate({rate: rhs.winRate});
			setRank({rank: rhs.rank});
			setPlay({play: rhs.gamesPlayed});
			setScore({score: rhs.score});
			setRoomID({roomID: rhs.roomID});
		});
	}, [navigate]);

	return (
		<UserContext.Provider
			value={{
				userName,
				setUserName,
				image,
				setImage,
				doubleAuth,
				setDoubleAuth,
				verified2FA,
				setVerified2FA,
				email,
				setEmail,
				lost,
				setLost,
				wins,
				setWins,
				rate,
				setRate,
				rank,
				setRank,
				play,
				setPlay,
				score,
				setScore,
				roomID,
				setRoomID,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext doit être utilisé à l\'intérieur d\'un composant UserContextProvider');
  }
  return context;
}
export default UserContext;
