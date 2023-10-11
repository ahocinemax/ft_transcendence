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


export type Achievements = {
	achievements: string[];
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

export type Games = {
	games: number;
};

export type Rate = {
	rate: number;
}

export type Wins = {
	wins: number;
}


type UserContextType = {
	userName: UserName;
	setUserName: React.Dispatch<React.SetStateAction<UserName>>;
	image: AuthImage;
	setImage: React.Dispatch<React.SetStateAction<AuthImage>>;
	achievements: Achievements;
	setAchievements: React.Dispatch<React.SetStateAction<Achievements>>;
	doubleAuth: DoubleAuth;
	setDoubleAuth: React.Dispatch<React.SetStateAction<DoubleAuth>>;
	verified2FA: DoubleAuthVerified;
	setVerified2FA: React.Dispatch<React.SetStateAction<DoubleAuthVerified>>;
	email: Email;
	setEmail: React.Dispatch<React.SetStateAction<Email>>;
	games: Games;
	setGames: React.Dispatch<React.SetStateAction<Games>>;
	wins: Wins;
	setWins: React.Dispatch<React.SetStateAction<Wins>>;
	rate: Rate;
	setRate: React.Dispatch<React.SetStateAction<Rate>>;
};

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({children}: UserContextProviderProps) => {
	const navigate = useNavigate();
	const [userName, setUserName] = useState<UserName>({userName: ''});
	const [image, setImage] = useState<AuthImage>({image: ''});
	const [achievements, setAchievements] = useState<Achievements>({
		achievements: [],
	});
	const [doubleAuth, setDoubleAuth] = useState<DoubleAuth>({
		doubleAuth: false});
	const [verified2FA, setVerified2FA] = useState<DoubleAuthVerified>({
		verified2FA: false,
	});
	const [email, setEmail] = useState<Email>({email: ''});
	const [games, setGames] = useState<Games>({games: 0});
	const [wins, setWins] = useState<Wins>({wins: 0});
	const [rate, setRate] = useState<Rate>({rate: 0});

	useEffect(() => {
		const userInfos = getUserInfo(navigate);
		userInfos.then((rhs) => {
			setUserName({userName: rhs.name});
			setImage({image: rhs.image});
			setDoubleAuth({doubleAuth: rhs.otp_enabled});
			setVerified2FA({verified2FA: rhs.otp_validated});
			setEmail({email: rhs.email});
			setGames({games: rhs.games});
			setWins({wins: rhs.wins});
			setRate({rate: rhs.winRate});
		});
	}, [navigate]);
	return (
		<UserContext.Provider
			value={{
				userName,
				setUserName,
				image,
				setImage,
				achievements,
				setAchievements,
				doubleAuth,
				setDoubleAuth,
				verified2FA,
				setVerified2FA,
				email,
				setEmail,
				games,
				setGames,
				wins,
				setWins,
				rate,
				setRate,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  //console.log('context', context);
  if (!context) {
    throw new Error('useUserContext doit être utilisé à l\'intérieur d\'un composant UserContextProvider');
  }
  return context;
}
export default UserContext;
