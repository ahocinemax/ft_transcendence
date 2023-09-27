import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const toggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  return (
    <div className="settings">
      <h1 className="Settingsh1">Settings</h1>
      <div className="settings_container">
        <div className="round_div_settings_img"></div>
        <p className="info">#PlayerPseudo</p>
        <p className="info">#Rank</p>
        <div className="twofa_container">
            <div className={`switch ${is2FAEnabled ? 'active' : ''}`} onClick={toggle2FA}>
              <div className="switch-button"></div>
            </div>
            <span className="twoFA_status">
              {is2FAEnabled ? '2FA Activé' : '2FA Désactivé'}
            </span>
        </div>
      </div>
    </div>
  );
}

export default Settings;
