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


  async function createUser(value: string) {
    let UserCreation = {
      name: value,
      isRegistered: true
    };
    const user = await backFunctions.createUser(UserCreation);
    //setUserInfosContext(value);
    return user;
  }

  async function checkUserToken() {
    const response = await backFunctions.checkIfTokenValid();
    // token not recognized -> redirect to login page
    if (response === undefined || response.statusCode == 400 || response.statusCode == 403) {
      // remove token from cookies
      document.cookie = "access_token=; path=/;";
      navigate('/login');
      return false;
    }
    // console.log('checkUserToken response: ', response);
    setTokenExists(true);
    return true;
  }

  function isAlphanum(inputString: string) {
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(inputString);
  }

  const handleNewPseudoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Mettre à jour l'état du nouveau pseudo lorsque l'utilisateur modifie le champ de saisie => Temp avec le back?
    setNewPseudo(event.target.value);
  };

  const createAndUpdateUser = async () => {
    // checkUserToken();
    if (newPseudo.length >= 3 && newPseudo.length <= 12 && isAlphanum(newPseudo)) {
      const newUser = await createUser(newPseudo); // le retour de newUser est dans .path
      if (newUser.statusCode === 200) {
        // const updatedUser = await backFunctions.updateUser(newUser.path.name, { name: newPseudo, isRegistered: true });
        // if (updatedUser) {
        //   console.log("User updated successfully:", updatedUser);
          setUserName({userName: newPseudo});
          navigate('/start');
        // }
      }
      else {
        console.log("User creation failed (no new user)");
      }
    }
  };

  //const { userName, games, image, } = useUserContext()
  return (
    <main>
      {/* {tokenExists ? ( */}
        <div className="settings">
          <h1 className="Settingsh1">Create profile</h1>
          <div className="settings_container">
            <div className="round_div_settings_img" style={{ backgroundImage: `https://res.cloudinary.com/transcendence42/image/upload/v1692378890/ft_transcendence/ft_transcendence_avator_utith7.png` }}></div>
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
              <button className="change_pseudo_button" onClick={createAndUpdateUser}>Choose nickname</button>
            </div>
          </div>
        {/* ) : <main><p>No user found</p></main>} */}
    </main>
  );
};

export default Settings;
