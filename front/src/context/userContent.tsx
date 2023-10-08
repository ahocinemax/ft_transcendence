import { createContext, useContext, useEffect, useState } from 'react';
import { backFunctions } from '../outils_back/BackFunctions';
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

export type UserName = {
	userName: string;
};

export type Image = {
	image: string;
};

export type Email = {
	email: string;
};

type UserContextType = {
	userName: UserName;
	setUserName: React.Dispatch<React.SetStateAction<UserName>>;
	image: Image;
	setImage: React.Dispatch<React.SetStateAction<Image>>;
	doubleAuth: DoubleAuth;
	setDoubleAuth: React.Dispatch<React.SetStateAction<DoubleAuth>>;
	verified2FA: DoubleAuthVerified;
	setVerified2FA: React.Dispatch<React.SetStateAction<DoubleAuthVerified>>;
	email: Email;
	setEmail: React.Dispatch<React.SetStateAction<Email>>;
};

export const UserContext = createContext({} as UserContextType);

console.log('UserContext');

const getInfosFromDB = async (navigate: NavigateFunction) => {
	const response = await backFunctions.getUserByToken();
	return response;
};

export const UserContextProvider = ({children}: UserContextProviderProps) => {
	const navigate = useNavigate();
	const [userName, setUserName] = useState<UserName>({userName: ''});
	const [image, setImage] = useState<Image>({image: ''});
	const [doubleAuth, setDoubleAuth] = useState<DoubleAuth>({doubleAuth: false});
	const [verified2FA, setVerified2FA] = useState<DoubleAuthVerified>({verified2FA: false,});
	const [email, setEmail] = useState<Email>({email: ''});

	useEffect(() => {
		const userInfos = getInfosFromDB(navigate);
		userInfos.then((rhs) => {
			setUserName({userName: rhs.name});
			setImage({image: rhs.image});
			setDoubleAuth({doubleAuth: rhs.otp_enabled});
			setVerified2FA({verified2FA: rhs.otp_validated});
			setEmail({email: rhs.email});
		});
	}, []);
	return (
        <UserContext.Provider value={{
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
		}}>
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
