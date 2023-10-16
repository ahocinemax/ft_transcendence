import React, { useEffect, useState } from 'react';
import './CreateProfile.css';
import { useNavigate } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';
import { useUserContext } from '../../context/userContent';

const CheckUser = () => {
const navigate = useNavigate();
const [tokenExists, setTokenExists] = useState(false);
async function checkCreateUser () {
  const user = await backFunctions.getUserByToken();
  console.log('checkCreateUser user: ', user);
  if (user && user.isRegistered == true) {
    console.log('User already created');
    navigate('/');
    return false;
  } else {
    // ユーザーが存在しない場合、createUserを呼び出
      return true;
  }
}

async function checkUserToken() {
  const response = await backFunctions.checkIfTokenValid();
  if (response.statusCode == 400 || response.statusCode == 403) {
    navigate('/');
    return false;
  }
  console.log('checkUserToken response: ', response);
  setTokenExists(true);
  return true;
}


useEffect(() => {
  async function initialize() {
    // まずトークンの有効性を確認
    const tokenResponse = await checkUserToken();
    if (tokenResponse) {
      const userResponse = await checkCreateUser();
      if (userResponse) {
        navigate('/create');
      }
    }
  }
  initialize();
}, []);
  return null;
};

export default CheckUser;