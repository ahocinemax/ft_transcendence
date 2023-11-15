import React, { useState } from 'react';
import './private_chan_popup.css';

interface PrivateChanPopup {
  onClose: () => void;
  onPasswordSubmit: (password: string) => void;
}

const PrivateChanPopup: React.FC<PrivateChanPopup> = ({ onClose, onPasswordSubmit }) => {  
  const [password, setPassword] = useState('');
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    onPasswordSubmit(password);
    onClose();
  };

  return (
    <div className="channel_creation_popup">
      <div className="channel_creation_popup_container">
        <span className="popup_close" onClick={onClose}>
          &times;
        </span>
        <h2 className="h1_popup_createchan">Enter password</h2>
        <input
          type="password"
          className="channel_creation_name"
          value={password}
          placeholder="Password"
          onChange={handlePasswordChange}
        />
        <button className="channel_button" onClick={handleSubmit}>
          Enter
        </button>
      </div>
    </div>
  );
};

export default PrivateChanPopup;
