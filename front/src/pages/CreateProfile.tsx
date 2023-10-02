import React, { useState } from 'react';
import './CreateProfile.css';

const Settings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pseudo, setPseudo] = useState('#PlayerPseudo'); // État pour stocker le pseudo
  const [newPseudo, setNewPseudo] = useState(''); // État pour stocker le nouveau pseudo

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

  const updatePseudo = () => {
    // Mettre à jour le pseudo avec le nouveau pseudo saisi
    if (newPseudo.length >= 3 && newPseudo.length <= 12 && isAlphanum(newPseudo))
        setPseudo(newPseudo);
    setNewPseudo(''); // Réinitialiser le champ de saisie
  };

  return (
    <div className="settings">
      <h1 className="Settingsh1">Create profile</h1>
      <div className="settings_container">
        <div className="round_div_settings_img"></div>
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
