import {createContext, useContext, useEffect, useState} from 'react';
import React from 'react';
import getUserInfo from './GetUserInfo';
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

export type Game = {
	game: number;
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
	game: Game;
	setGame: React.Dispatch<React.SetStateAction<Game>>;
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
	const [doubleAuth, setDoubleAuth] = useState<DoubleAuth>({doubleAuth: false});
	const [verified2FA, setVerified2FA] = useState<DoubleAuthVerified>({
		verified2FA: false,
	});
	const [email, setEmail] = useState<Email>({email: ''});
	const [game, setGame] = useState<Game>({game: 0});
	const [wins, setWins] = useState<Wins>({wins: 0});
	const [rate, setRate] = useState<Rate>({rate: 0});

	useEffect(() => {
		const userInfos = getUserInfo(navigate);
		userInfos.then((res) => {
			setUserName({userName: res.name});
			setImage({image: res.image});
			setAchievements({achievements: res.achievements});
			setDoubleAuth({doubleAuth: res.otp_enabled});
			setVerified2FA({verified2FA: res.otp_validated});
			setEmail({email: res.email});
			setGame({game: res.games});
			setWins({wins: res.wins});
			setRate({rate: res.rate});
		});
	}, []);
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
				game,
				setGame,
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

export function useUserInfos() {
	return useContext(UserContext);
}

export default UserContext;
