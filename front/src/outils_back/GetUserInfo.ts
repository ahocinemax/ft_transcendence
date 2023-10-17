import { ok } from 'assert';
import { backFunctions } from './BackFunctions';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const getUserInfo = async (navigate: NavigateFunction) => {
	const response = await backFunctions.getUserByToken();
	//console.log("response getUserInfo: ", response);
	//if (response === "error" || response === undefined) {
	//	return null;
	//}
	return response;
};

export default getUserInfo;

