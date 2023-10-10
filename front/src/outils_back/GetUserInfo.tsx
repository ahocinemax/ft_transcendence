import { backFunctions } from './BackFunctions';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const getUserInfo = async (navigate: NavigateFunction) => {
	const response = await backFunctions.getUserByToken();
	return response;
};

export default getUserInfo;

