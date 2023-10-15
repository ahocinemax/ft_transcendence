import React, { useEffect, useState } from 'react';
import './CreateProfile.css';
import { useNavigate } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';
import { useUserContext } from '../../context/userContent';

const CheckUser = () => {
  const navigate = useNavigate();
  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    async function fetchData() {
      // Check if user is already registered
      const user = await backFunctions.getUserByToken();
      if (user && user.isRegistered === true) {
        console.log('User already created');
        navigate('/');
        return;
      }

      // Check if token is valid
      const response = await backFunctions.checkIfTokenValid();
      if (response.statusCode === 400 || response.statusCode === 403) {
        console.log('Invalid or expired token');
        navigate('/');
        return;
      }

      console.log('Valid token and user not registered');
      setTokenExists(true);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (tokenExists) {
      navigate('/create');
    }
  }, [tokenExists]);

  return null;
};

export default CheckUser;
