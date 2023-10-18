import { ok } from 'assert';
import { backFunctions } from './BackFunctions';
import { NavigateFunction, useNavigate } from 'react-router-dom';

/**
 * getUserInfo set 'userToken' cookie and return user's info.
 * This var is used all over the app.
 * It will be refreshed each time userContext is called.
 * @
 * @param navigate
 * @returns user info
*/
const getUserInfo = async (navigate: NavigateFunction) => {
	// Check if access token is in cookie before calling getUserByToken
	const cookie = document.cookie;
	const cookieArray = cookie.split(';');
	let accessToken = '';
	for (let i = 0; i < cookieArray.length; i++) {
		if (cookieArray[i].includes('access_token')) {
			accessToken = cookieArray[i].split('=')[1];
			break;
		}
	}
	localStorage.setItem("userToken", accessToken);
	return (accessToken === ''|| accessToken === 'undefined') ? null : await backFunctions.getUserByToken();
};

export default getUserInfo;
