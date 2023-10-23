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
  const [messagesData, setMessagesData] = useState<MessageData>({});
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

  const handleSearch = (query: string) => {
    console.log(`Recherche en cours pour : ${query}`);
  };

  const handleChannelClick = (channelId: number) => {
    if (PasswordNeeded)
        return;
    const channel: channelModel = channels.find((c: any) => c.name === channelId);
    if (channel && channel.isPrivate)
    {
        setTempActiveChannel(channelId);
        // Ensuite, activez le mot de passe
        setPassword(true);
    } else {
      // Salon public, accédez directement
      setActivePrivateConversation(0);
      setActiveChannel(channelId);
    }
  };

  const handlePrivMsgClick = (channelId: number) => {
    setActiveChannel(0);
    setActivePrivateConversation(channelId);
  };

  const addPrivateUser = (userName: string) => {
    // Créez une copie de la liste priv_msgs avec le nouvel utilisateur ajouté
    const updatedPrivateUsers = [...priv_msgs, { name: userName }];
    setPriv_msgs(updatedPrivateUsers);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (messageInput.trim() !== '') {
      const newMessage = {
        sender: userInfos.userName.userName,
        time: new Date().toLocaleTimeString(),
        content: messageInput,
      };
  
      if (activeChannel) {
        // Send message to backend
        socket?.emit('new message', {
          channelId: activeChannel,
          message: newMessage.content,
          email: userInfos.email.email,
        });
  
        // wait backend's response (updated messages list)
        socket?.on('message updated', (updatedMessagesData) => {
          
          setMessagesData(updatedMessagesData);
        });
      } else if (activePrivateConversation) {
        // send message to backend
        socket?.emit('new private message', {
          conversation: activePrivateConversation,
          message: newMessage,
        });
  
        // Attendez une réponse du backend avec la liste actualisée des messages
        socket?.on('private message updated', (updatedPrivateMessagesData) => {
          setPrivateMessagesData(updatedPrivateMessagesData);
        });
      }
  
      setMessageInput('');
    }
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

  useEffect(() => {
    /* Récupérer ici tous les channels de notre base de données sous forme d'array*/
    // Send request
    socket?.emit('get channels', userInfos.email.email, (data: any) => {
      console.log('data1: ', data);
    });
    // Handle response
    socket?.on('fetch channels', (data: channelModel[]) => {
      console.log('data2: ', data);
      const dmTrue = data.filter((item) => item.dm === true);
      const dmFalse = data.filter((item) => item.dm === false);
      setChannels(dmFalse);
      setPriv_msgs(dmTrue);
    });
  }, [userInfos]);

  interface MessageData 
  {
    [key: string]: {
      sender: string;
      time: string;
      content: string;
    }[];
  }

  interface PrivateMessagesData 
  {
    [key: string]: {
      sender: string;
      time: string;
      content: string;
    }[];
  }

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

  const handleSubmit = (res: any) => {
    const data = {
      name: res.channelName,
      private: res.private,
      password: res.password,
      email: userInfos.email.email,
      isProtected: res.private
    };

    socket?.emit('new channel', data);
    socket?.on('update channels', (data: any) => {
      if (data?.dm === false) setChannels(data);
      else setPriv_msgs(data);
    });
  }

  return (
    <div className="chat">
        <div className="chan_privmsg_container">
            <div className="channel_part" onClick={closeUserPopup}>
              <div className="searchbar_div">
                <SearchComponent onSearch={handleSearch} />
              </div>
              <div className="channel_top_div">
                <h1 className="h1_channel">#Channels(42)</h1>
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
                <h1 className="h1_channel">#MP List(42)</h1>
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
                    <h1 className="channel_title active_channel_title">#{activeChannel}</h1>
                <ul>
                {messagesData[activeChannel]?.map((message, index) => (
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
              )}

               {/* Champ de texte pour envoyer des messages */}
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

            
                {activePrivateConversation && (
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
              )}

               {/* Champ de texte pour envoyer des messages */}
               {activePrivateConversation && (
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