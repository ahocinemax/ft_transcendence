import React, { useState, useContext, useEffect } from 'react';
import './Chat.css'; 
import SearchComponent from '../../components/SearchComponent/SearchComponent';
import ChannelNamePopup from '../../components/channel_name_popup/channel_name_popup';
import PrivateChanPopup from '../../components/Private_chan_popup/private_chan_popup';
import SocketContext from '../../context/socketContext';
import { backFunctions } from '../../outils_back/BackFunctions';
import UserContext from '../../context/userContent';
import { channelModel } from '../../interface/global'
// import { act } from '@testing-library/react';


const Chat = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [PasswordNeeded, setPassword] = useState(false);
  const [activeChannel, setActiveChannel] = useState(0);
  const [messageInput, setMessageInput] = useState(''); // État pour stocker le message en cours de frappe
  const [messagesData, setMessagesData] = useState<MessagesArray>([]);
  const [channelName, setChannelName] = useState(''); // État pour stocker le nom du canal en cours de création
  const [privateMessagesData, setPrivateMessagesData] = useState<PrivateMessagesData>({});
  const [activePrivateUser, setActivePrivateUser] = useState('');
  const [activePrivateConversation, setActivePrivateConversation] = useState(0);
  const [selectedUser, setSelectedUser] = useState('');
  const [isUserPopupVisible, setIsUserPopupVisible] = useState(false);
  const { socket } = useContext(SocketContext).SocketState;
  const userInfos = useContext(UserContext);
  const [privatePassword, setPrivatePassword] = useState(''); // État pour le mot de passe privé
  const [tempActiveChannel, setTempActiveChannel] = useState(0); // État temporaire pour stocker le canal sur lequel vous avez cliqué
  const [channels, setChannels] = useState<any>([]);
  const [priv_msgs, setPriv_msgs] = useState<any>([]);

  // TYPES DEFINITIONS
  type MessageData = {
    msgId: number;
    id: number;
    channelId: number;
    email: string;
    message: string;
    createAt: string;
    updateAt: string;
    isInvite: boolean;
  };

  type MessagesArray = MessageData[];
  interface PrivateMessagesData 
  {
    [key: string]: {
      sender: string;
      time: string;
      content: string;
    }[];
  }

  // HOOKS

  useEffect(() => { // Handle events : 'fetch channels', 'fetch mp'

    // Send channel list request
    socket?.emit('get channels', userInfos.email.email, (data: any) => {}); // 1st load of channels
    socket?.on('fetch channels', (data: channelModel[]) => {
      data = !Array.isArray(data) ? Array.from(data) : data;
      setChannels(data);
    });

    // Send MP list request
    socket?.emit('get mp', userInfos.email.email, (data: any) => {});
    socket?.on('fetch mp', (data: channelModel[]) => {
      data = !Array.isArray(data) ? Array.from(data) : data;
      setPriv_msgs(data);
    });
    return () => {
      socket?.off('fetch channels');
      socket?.off('fetch mp');
    };
  }, [socket]);

  useEffect(() => { // handle events : 'fetch message', 'update channel request'
    if (activeChannel && socket) socket.emit('get messages', activeChannel, (data: any) => {});
    socket?.on('fetch messages', (updatedMessagesData) => { // Just clicked on chan, must fetch messages
        setMessagesData(updatedMessagesData);
    });
    socket?.on('update private request', (updatedPrivateMessagesData) => {
      setPrivateMessagesData(updatedPrivateMessagesData);
    });
    socket?.on('update message request', (data: any) => {
      socket?.emit('get messages', activeChannel);
    });
    socket?.on('update channel request', (data: any) => {
      socket?.emit('get channels');
    });
    return () => {
      socket?.off('fetch messages');
      socket?.off('update private request');
      socket?.off('update message request');
      socket?.off('update channel request');
    };
  }, [socket, activeChannel]);

  // EVENT HANDLERS
  const handleSearch = (query: string) => {
    console.log(`Recherche en cours pour : ${query}`);
  };

  const handleChannelClick = (channelId: number) => {
    if (PasswordNeeded)
        return;
    const channel: channelModel = channels.find((c: any) => c.id === channelId);
    if (channel && channel.isPrivate)
    {
        setTempActiveChannel(channelId);
        // Ensuite, activez le mot de passe
        setPassword(true);
        setChannelName(channel.name);
    } else {
      // Salon public, accédez directement
      setChannelName(channel.name);
      setActivePrivateConversation(0);
      setActiveChannel(channelId);
    }
  };

  const handlePrivMsgClick = (channelId: number) => {
    setActiveChannel(0);
    setActivePrivateConversation(channelId);
  };

  const addPrivateUser = (userName: string) => {
    const data: any = {
      name: userName,
      dm: true,
      ownerEmail: userInfos.email.email,
    };
    socket?.emit('new mp', userInfos.userName.userName, data);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();

    if (messageInput.trim() === '') return;
    const newMessage = {
      sender: userInfos.userName.userName,
      time: new Date().toLocaleTimeString(),
      content: messageInput,
    };
    if (activeChannel) {
      // Send public message to backend
      socket?.emit('new message', {
        channelId: activeChannel,
        message: newMessage.content,
        email: userInfos.email.email,
      });
      
    } else if (activePrivateConversation) {
      // send private message to backend
      socket?.emit('new private message', {
        conversation: activePrivateConversation,
        message: newMessage,
      });
    }

    setMessageInput('');
  };

  const handleUserClick = (userName: string) => {
    setSelectedUser(userName);
    setIsUserPopupVisible(true);
  };

  const closeUserPopup = () => {
    setSelectedUser('');
    setIsUserPopupVisible(false);
  };

  const handlePasswordSubmit = (password: string) => {
    // Vérifiez si le mot de passe saisi correspond à celui du canal actif
    const channel: channelModel = channels.find((c: any) => c.name === tempActiveChannel);
    
    if (channel && channel.password === password) {
      // Mot de passe correct, accédez au canal
      setPassword(false); // Fermez le pop-up de mot de passe
      setActiveChannel(tempActiveChannel);
    } else { // Mot de passe incorrect, affichez un message d'erreur ou gérez-le comme vous le souhaitez
      console.log('Mot de passe incorrect');
    }
  };

  const createChannel = () => 
  {
    /* Fonction back pour créer un channel */
    setIsPopupOpen(true);
  }

  const closePopup = () => 
  {
    // Close the pop-up
    setIsPopupOpen(false);
  };

  const askPassword = () => 
  {
    /* Fonction back pour créer un channel */
    setPassword(true);
  }

  const PasswordDone = () => 
  {
    // Close the pop-up
    setPassword(false);
  };

  // handle create new channel component
  const handleSubmit = (res: any) => {
    const data = {
      name: res.channelName,
      private: res.private,
      password: res.password,
      email: userInfos.email.email,
      isProtected: res.private
    };

    socket?.emit('new channel', data);
  }

  return (
    <div className="chat">
      <div className="chan_privmsg_container">
          <div className="channel_part" onClick={closeUserPopup}>
            <div className="searchbar_div">
              <SearchComponent onSearch={handleSearch} />
            </div>
            <div className="channel_top_div">
              <h1 className="h1_channel">#Channels({channels ? channels.length : 0})</h1>
              <h1 className="createchan" onClick={createChannel}>+</h1>
              {isPopupOpen && <ChannelNamePopup onHandleSubmit={handleSubmit} onClose={closePopup} />}
            </div>
            <div className="channel_div_container">
              {channels.map((channel: channelModel, index: number) => (
                <div className="channel_div" key={index} onClick={() => handleChannelClick(channel.id)}>
                  {PasswordNeeded && (
                    <PrivateChanPopup onClose={PasswordDone} onPasswordSubmit={handlePasswordSubmit} />
                  )}
                  <div className="channel_content">
                    <h1 className="channel_title">#{channel.name}</h1>
                    {channel.isPrivate && (
                      <img src="lock.png" alt="Private Channel" className="lock_icon" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="priv_msg_part">
            <h1 className="h1_channel">#MP List({priv_msgs ? priv_msgs.length : 0})</h1>
            <div className="private_users_container">
              {priv_msgs.map((privateChannel: channelModel, index: number) => (
              <div className="channel_div privmsg" key={index} onClick={() => handlePrivMsgClick(privateChannel.id)}>
                <div className="channel_content">
                  <h1 className="channel_title">#{privateChannel.name}</h1>
                </div>
              </div>
              ))}
            </div>
          </div>
      </div>
      <div className="main_part">
        {activeChannel && (
          <div className="message_list">
              <h1 className="channel_title active_channel_title">#{channelName}</h1>
          <ul>
          {activeChannel && messagesData && messagesData.map((message: MessageData, index: number) => {
              return (
                <li key={index}>
                  <div
                    className={`message_bubble ${message.id !== undefined ? 'user' : 'not_user'}`}
                    style={{
                      width: `${Math.min(100, message.message.length)}%`, // Adjust the maximum width as needed
                    }}
                  >
                    <span
                      className="message_sender"
                      onClick={() => handleUserClick(message.email)} // Gérer le clic sur le nom de l'utilisateur
                    >
                      <strong>{message.id} </strong>
                    </span>
                    ({message.createAt}): {message.createAt}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        )}
        {activeChannel && (
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="send_msg"
            />
          </form>
        )} 
        {/* {activePrivateConversation && (
        <div className="message_list">
          <h1 className="channel_title active_channel_title">#{activePrivateConversation}</h1>
          <ul>
            {privateMessagesData[activePrivateConversation]?.map((message, index) => (
              <li key={index}>
                <div
                  className={`message_bubble ${
                    message.sender === 'Utilisateur 1' ? 'user' : 'not_user'
                  }`}
                  style={{
                    width: `${Math.min(100, message.content.length)}%`, // Adjust the maximum width as needed
                  }}
                >
                  <span
                    className="message_sender"
                    onClick={() => handleUserClick(message.sender)} // Gérer le clic sur le nom de l'utilisateur
                  >
                    <strong>{message.sender} </strong>
                  </span>
                  ({message.time}): {message.content}
                </div>
              </li>
            ))}
          </ul>
        </div>
        )} */}
        {/* {activePrivateConversation && (
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="send_msg"
              />
            </form>
        )} */}
      </div>
      <div className={`user_popup ${isUserPopupVisible && selectedUser ? 'visible' : ''}`}>
        <div className="close_button" onClick={closeUserPopup}>
          X
        </div>
        <div className="popup_content">
          <p className="user_popup_name">{selectedUser}</p>
          <img src="./avatar.png" alt="User Avatar" className="img_popup1"/>
          <div className="chat_button_container">
            <div className="chat_buttons DUEL"></div>
            <div className="chat_buttons MSG" onClick={() => addPrivateUser(selectedUser)}></div>
            <div className="chat_buttons ADD_FRIEND"></div>
            <div className="chat_buttons BLOCK"></div>
          </div>
          <div className="chat_button_container">
            <div className="chat_buttons MUTE"></div>
            <div className="chat_buttons KICK"></div>
            <div className="chat_buttons BAN"></div>
          </div>
        </div>
      </div>      
    </div>
  );
}

export default Chat;