import React, { useState } from 'react';
import './channel_name_popup.css';

interface ChannelNamePopupProps {
  onClose: () => void;
}

const ChannelNamePopup: React.FC<ChannelNamePopupProps> = ({ onClose }) => 
{
  const [channelName, setChannelName] = useState(''); // Initialize channelName as an empty string

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value); // Update channelName when the input changes
  };

  return (
    <div className="channel_creation_popup">
      <div className="channel_creation_popup_container">
        <h2 className="h1">Create channel</h2>
        <input
          type="text"
          className="channel_creation_name"
          value={channelName}
          placeholder="Channel name"
          onChange={handleInputChange}
        />
        <button className="channel_button" onClick={onClose}>Create</button>
      </div>
    </div>
  );
};

export default ChannelNamePopup;
