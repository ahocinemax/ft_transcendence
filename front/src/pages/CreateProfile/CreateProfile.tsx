import React, { useState, useEffect } from 'react';
import './CreateProfile.css';
import { useNavigate } from 'react-router-dom';
import { backFunctions } from '../../outils_back/BackFunctions';
import { useUserContext } from '../../context/userContent';

const Settings = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(false); // État pour stocker le token
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pseudo, setPseudo] = useState('#PlayerPseudo'); // État pour stocker le pseudo
  const [newPseudo, setNewPseudo] = useState(''); // État pour stocker le nouveau pseudo
  const [tokenExists, setTokenExists] = useState(false);
  const { setUserName } = useUserContext(); 
  async function checkCreateUser () {
    const user = await backFunctions.getUserByToken();
    if (user && user.isRegistered == true){
      console.log('User already created');
      navigate('/');
      return;
    }
  }

  async function checkUserToken() {
    const response = await backFunctions.checkIfTokenValid();
    if (response.statusCode == 400 || response.statusCode == 403) {
      navigate("/");
      return;
    }
    setTokenExists(true);
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

  useEffect(() => {
    checkCreateUser();
    //checkUserToken();
  }, []);




  const { userName, games, image, } = useUserContext()
  return (
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
    </div>
  );
};

export default Settings;
