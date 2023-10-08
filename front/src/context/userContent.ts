import {createContext, useContext, useEffect, useState} from 'react';
import getInfosFromDB from './GetuserFromDB';
import {Achievements} from 'pages/Dashboard/components/Achievements/Achievements.styles';
import { backend } from 'lib/backend';
import { NavigateFunction, useNavigate } from 'react-router-dom';

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
};

export const UserContext = createContext({} as UserContextType);

const getInfosFromDB = async (navigate: NavigateFunction) => {
	const response = await backend.getUserByToken();
	return response;
};

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

	useEffect(() => {
		const userInfos = getInfosFromDB(navigate);
		userInfos.then((res) => {
			setUserName({userName: res.name});
			setImage({image: res.image});
			setAchievements({achievements: res.achievements});
			setDoubleAuth({doubleAuth: res.otp_enabled});
			setVerified2FA({verified2FA: res.otp_validated});
			setEmail({email: res.email});
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
