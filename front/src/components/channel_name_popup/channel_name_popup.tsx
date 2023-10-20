import React, { useState, useContext } from 'react';
import './channel_name_popup.css';
import SocketContext from '../../context/socketContext';
import useUserContext from '../../context/userContent';
import { backFunctions } from '../../outils_back/BackFunctions';

interface ChannelNamePopupProps {
  onClose: () => void;
}

const ChannelNamePopup: React.FC<ChannelNamePopupProps> = ({ onClose }) => {
  const [channelName, setChannelName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
	const {socket} = useContext(SocketContext).SocketState;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelName(e.target.value);
  };

  const handleSwitchChange = () => {
    setIsPrivate(!isPrivate);
  };

  const setOwnerInfo = async () => {
    const owner = await backFunctions.getUserByToken();
    return owner;
  }

  async function handleCreateChannel(data: any) {

    // Utilisez la connexion socket pour émettre 'newchannel' avec les informations
    socket?.emit('new.channel', { data: {
                  channelName,
                  isPrivate,
                  password,
                  setOwnerInfo,
                  // ...data,
                }},
                (response: any) => {});
    socket?.on('add preview', (data: any) => {
      console.log('data: ', data);
    });

    // Fermez la popup après l'envoi
    onClose();
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
        <button className="channel_button" onClick={handleCreateChannel}>
          Create
        </button>
      </div>
    </div>
  );
};

export default ChannelNamePopup;
