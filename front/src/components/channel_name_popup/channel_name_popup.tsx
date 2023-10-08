import React, { useState } from 'react';
import './channel_name_popup.css';

interface ChannelNamePopupProps {
  onClose: () => void;
}

const ChannelNamePopup: React.FC<ChannelNamePopupProps> = ({ onClose }) => {
  const [channelName, setChannelName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };

  const handleSwitchChange = () => {
    setIsPrivate(!isPrivate);
  };

  return (
    <div className="channel_creation_popup">
      <div className="channel_creation_popup_container">
        <span className="popup_close" onClick={onClose}>
          &times;
        </span>
        <h2 className="h1_popup_createchan">Create channel</h2>
        <input
          type="text"
          className="channel_creation_name"
          value={channelName}
          placeholder="Channel name"
          onChange={handleInputChange}
        />
        <label className="switch">
          <input type="checkbox" checked={isPrivate} onChange={handleSwitchChange} />
          <span className={`slider ${isPrivate ? 'on' : 'off'}`}></span>
        </label>
        {isPrivate && (
          <div className="private_info">
            <img src="lock.png" alt="Private Channel" className="lock_icon_popup" />
            <input
              type="password"
              className="password_input"
              value={password}
              placeholder="Channel password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}
        <button className="channel_button" onClick={onClose}>
          Create
        </button>
      </div>
    </div>
  );
};

export default ChannelNamePopup;
