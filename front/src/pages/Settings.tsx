import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggle2FA = () => {
    if (!is2FAEnabled)
    {
        setIsModalOpen(!is2FAEnabled); // Ouvre la boîte modale lorsque le 2FA est activé
    }
    setIs2FAEnabled(!is2FAEnabled);
  };

  const closeModal = () => {
    if (is2FAEnabled)
    {
        setIsModalOpen(false);
        setIs2FAEnabled(!is2FAEnabled);
    }
  };

  return (
    <div className="settings" onClick={closeModal}>
      <h1 className="Settingsh1">Settings</h1>
      <div className="settings_container">
        <div className="round_div_settings_img"></div>
        <p className="info">#PlayerPseudo</p>
        <p className="info">#Rank</p>
        <div className="twofa_container">
          {/* Gestion du clic sur le switch */}
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

      {/*PopUp */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <p className="info_tiny">Enter the code recieved by e-mail to enable 2FA :</p>
            <input type="text" placeholder="Code" />
            <button className="popup_enter_button" onClick={closeModal}>Enter</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
