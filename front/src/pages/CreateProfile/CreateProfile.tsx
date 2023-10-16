import React, { useState, useEffect, useCallback } from 'react';
import './CreateProfile.css';
import { useNavigate } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';
import { useUserContext } from '../../context/userContent';

const Settings = () => {
  const navigate = useNavigate();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pseudo, setPseudo] = useState('#PlayerPseudo'); // État pour stocker le pseudo
  const [newPseudo, setNewPseudo] = useState(''); // État pour stocker le nouveau pseudo
  const [tokenExists, setTokenExists] = useState(false);
  const [isUserCreated, setIsUserCreated] = useState(false);

  const {
    userName,
    setUserName,
    image,
    setImage,
  } = useUserContext();

  async function setUserInfosContext(value: string) {
    try {
      const userInfos: any = await backFunctions.getUserByToken();
      setUserName({userName: value});
      setImage({image: image.image});
      return true;
    } catch (error) {
      console.error("Failed to set user info:", error);
      return false;
    }
  }

  async function createUser(value: string) {
    let UserCreation = {
      name: value,
      isRegistered: true,
    };
    const user = await backFunctions.createUser(UserCreation);
    //setUserInfosContext(value);
    return user;
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

  const toggle2FA = () => {
    if (!is2FAEnabled) {
      setIsModalOpen(!is2FAEnabled);
    }
    setIs2FAEnabled(!is2FAEnabled);
  };

  const closeModal = () => {
    if (is2FAEnabled) {
      setIsModalOpen(false);
      setIs2FAEnabled(!is2FAEnabled);
    }
  };

  function isAlphanum(inputString: string) {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(inputString);
  }

  const handlePseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Mettre à jour l'état du pseudo lorsque l'utilisateur modifie le champ de saisie => Temp avec le back?
    if (pseudo.length >= 3 && pseudo.length <= 12 && isAlphanum(pseudo))
        setPseudo(event.target.value);
    /* else
        setPseudo(pseudo); */
  };

  const handleNewPseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Mettre à jour l'état du nouveau pseudo lorsque l'utilisateur modifie le champ de saisie => Temp avec le back?
    setNewPseudo(event.target.value);
  };

  const updatePseudo = async () => {
    // Mettre à jour le pseudo avec le nouveau pseudo saisi
    if (newPseudo.length >= 3 && newPseudo.length <= 12 && isAlphanum(newPseudo))
        setPseudo(newPseudo);
    try {
          const updatedUser = await backFunctions.updateUser(userName.userName, { name: newPseudo, isRegistered: true });
          if (updatedUser) {
            console.log("User updated successfully:", updatedUser);
            setUserName({userName: newPseudo});
            navigate('/');
          }
        } catch (error) {
          console.error("Failed to update user:", error);
        }
    setNewPseudo(''); // Réinitialiser le champ de saisie
  };

  // useEffect(() => {
  //   async function initialize() {
  //     // まずトークンの有効性を確認
  //     const tokenResponse = await checkUserToken();
  //     if (tokenResponse) {
  //       const newuser = await createUser(userName.userName);
  //       if (newuser) {
  //         await setUserInfosContext(userName.userName);
  //       }
  //     }
  //   }
  //   initialize();
  // }, []);


  useEffect(() => {
    async function initialize() {
      const tokenResponse = await checkUserToken();
      if (tokenResponse) {
        const newUser = await createUser("newUser");
        if (newUser) {
          const userInfoSet = await setUserInfosContext("newUser");
          if (userInfoSet) {
            setIsUserCreated(true);
          }
        }
      }
    }
    initialize();
  }, []);

  //const { userName, games, image, } = useUserContext()
  return (
    <main>
      {tokenExists ? (
        <div className="settings">
          <h1 className="Settingsh1">Create profile</h1>
          <div className="settings_container">
            <div className="round_div_settings_img" style={{ backgroundImage: `url(${image.image})` }}></div>
          </div>

          {/* Swap nickname */}
            <div className="change_nick_input">
              <input
                type="text"
                className="change_nick_input"
                value={newPseudo}
                onChange={handleNewPseudoChange}
                placeholder="Nickname"
              />
              <button className="change_pseudo_button" onClick={updatePseudo}>Choose nickname</button>
            </div>
        </div>) : <main><p>No user found</p></main>}
    </main>
  );
};

export default Settings;
