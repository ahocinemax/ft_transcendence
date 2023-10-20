import React, { useEffect, useState } from 'react';
import './CreateProfile.css';
import { useNavigate } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';
import { useUserContext } from '../../context/userContent';

const CheckUser = () => {
	const navigate = useNavigate();
	const [tokenExists, setTokenExists] = useState(false);

	async function checkCreateUser () { //!\/ if user logged out, token is removed (it will always return true)
		console.log("checkCreateUser");
		const user = await backFunctions.getUserByToken();
		if (user && user.isRegistered === true) { // user already created -> redirect to homepage
			console.log('User already created');
			navigate('/start');
			return false;
		} else // ユーザーが存在しない場合、createUserを呼び出
			return true;
	}

	async function checkUserToken() {
		const response = await backFunctions.checkIfTokenValid();
		if (response.statusCode === 400 || response.statusCode === 403) { // token not recognized -> redirect to login page
			navigate('/login');
			return false;
		}
		setTokenExists(true);
		return true;
	}


	useEffect(() => {
		async function initialize() {
			// まずトークンの有効性を確認

			const tokenResponse = await checkUserToken();
			if (tokenResponse) {
				const userResponse = await checkCreateUser();
				if (userResponse) navigate('/create');
			}
		}
		initialize();
	}, []);

	return null;
};

export default CheckUser;