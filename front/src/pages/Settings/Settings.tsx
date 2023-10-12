import React, { useState, useRef } from 'react';
import './Settings.css';

const Settings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pseudo, setPseudo] = useState('#PlayerPseudo'); // État pour stocker le pseudo
  const [newPseudo, setNewPseudo] = useState(''); // État pour stocker le nouveau pseudo
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png')
        setSelectedImage(file);
      else
        alert("You need to upload either a .jpg, .jpeg or .png file");
    }
  };

  const openImageUploader = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const roundDivSettingsImgStyle = {
    backgroundImage: selectedImage ? `url(${URL.createObjectURL(selectedImage)})` : '',
  };

  return (
    <div className="settings" onClick={closeModal}>
      <h1 className="Settingsh1">Settings</h1>
      <div className="settings_container">
      <div
        className="round_div_settings_img"
        onClick={openImageUploader}
        style={{
          backgroundImage: selectedImage
            ? `url(${URL.createObjectURL(selectedImage)})`
            : '',
        }}></div>
        <p className="info_settings">{pseudo}</p> {/* Afficher le pseudo actuel, faudrait prendre celui du back */}
        <p className="info_settings">#Rank</p>
        <div className="twofa_container">
          <span
            className={`twoFA_status ${!is2FAEnabled ? 'clickable' : ''}`}
            onClick={toggle2FA}
          >
            {is2FAEnabled ? '2FA Activé' : '2FA Désactivé'}
          </span>
          <div className={`switch ${is2FAEnabled ? 'active' : ''}`} onClick={toggle2FA}>
            <div className="switch-button"></div>
          </div>
        </div>
      </div>

      {/* Swap nickname */}
        <div className="change_nick_input">
        <input
            type="file"
            ref={imageInputRef}
            accept=".jpg, .jpeg, .png"
            style={{ display: 'none' }}
            onChange={handleImageChange}/>
          <button className="change_pseudo_button" onClick={updatePseudo}>Changer le pseudo</button>
        </div>

      {/* PopUp */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <p className="info_tiny">Enter the code received by e-mail to enable 2FA :</p>
            <input type="number" placeholder="Code" />
            <button className="popup_enter_button" onClick={closeModal}>Enter</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
