import React, { useState, useContext } from 'react';
import './Chat.css'; 
import SearchComponent from '../../components/SearchComponent/SearchComponent';
import ChannelNamePopup from '../../components/channel_name_popup/channel_name_popup';
import PrivateChanPopup from '../../components/Private_chan_popup/private_chan_popup';
import SocketContext from '../../context/socketContext';
// import { act } from '@testing-library/react';


const Chat = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [PasswordNeeded, setPassword] = useState(false);
    const [activeChannel, setActiveChannel] = useState('');
    const [messageInput, setMessageInput] = useState(''); // État pour stocker le message en cours de frappe
    const [messagesData, setMessagesData] = useState<MessageData>({});
    const [privateMessagesData, setPrivateMessagesData] = useState<PrivateMessagesData>({});
    const [activePrivateUser, setActivePrivateUser] = useState('');
    const [activePrivateConversation, setActivePrivateConversation] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [isUserPopupVisible, setIsUserPopupVisible] = useState(false);
    const { socket } = useContext(SocketContext).SocketState;

    const [privatePassword, setPrivatePassword] = useState(''); // État pour le mot de passe privé
    const [tempActiveChannel, setTempActiveChannel] = useState(''); // État temporaire pour stocker le canal sur lequel vous avez cliqué



    const handleSearch = (query: string) => 
    {
    console.log(`Recherche en cours pour : ${query}`);
  };



  const handleChannelClick = (channelName: string) => {
    if (PasswordNeeded)
        return;
    const channel = channels.find((c) => c.name === channelName);
    if (channel && channel.isPrivate) 
    {
        setTempActiveChannel(channelName);
  
        // Ensuite, activez le mot de passe
        setPassword(true);
    } else {
      // Salon public, accédez directement
      setActivePrivateConversation('');
      setActiveChannel(channelName);
    }
  };
  

    const handlePrivMsgClick = (userName: string) => {
        setActiveChannel('');
        setActivePrivateConversation(userName);
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
                sender: 'Utilisateur',
                time: new Date().toLocaleTimeString(),
                content: messageInput,
            };
    
            if (activeChannel) {
                const updatedMessagesData = { ...messagesData };
                if (!updatedMessagesData[activeChannel]) {
                    updatedMessagesData[activeChannel] = [];
                }
                updatedMessagesData[activeChannel].push(newMessage);
                setMessagesData(updatedMessagesData);
            } else if (activePrivateConversation) {
                const updatedPrivateMessagesData = { ...privateMessagesData };
                if (!updatedPrivateMessagesData[activePrivateConversation]) {
                    updatedPrivateMessagesData[activePrivateConversation] = [];
                }
                updatedPrivateMessagesData[activePrivateConversation].push(newMessage);
                setPrivateMessagesData(updatedPrivateMessagesData);
            }
    
            setMessageInput('');
        }
    };


      const handleUserClick = (userName: string) => 
      {
        setSelectedUser(userName);
        setIsUserPopupVisible(true);
      };

      const closeUserPopup = () => 
      {
        setSelectedUser('');
        setIsUserPopupVisible(false);
      };

      const handlePasswordSubmit = (password: string) => {
        // Vérifiez si le mot de passe saisi correspond à celui du canal actif
        const channel = channels.find((c) => c.name === tempActiveChannel);
        
        if (channel && channel.password === password) {
            // Mot de passe correct, accédez au canal
            setPassword(false); // Fermez le pop-up de mot de passe
            setActiveChannel(tempActiveChannel);
        } else {
          // Mot de passe incorrect, affichez un message d'erreur ou gérez-le comme vous le souhaitez
          console.log('Mot de passe incorrect');
        }
      };


  /* Récupérer ici tous les channels de notre base de données sous forme d'array*/
  const channels = [
    { name: 'Channel 1', isPrivate: false },
    { name: 'Channel 2', isPrivate: true, password: 'motdepasse2' },
    { name: 'Channel 3', isPrivate: false },
    { name: 'Channel 4', isPrivate: false },
    { name: 'Channel 5', isPrivate: true, password: 'motdepasse5' },
    { name: 'Channel 6', isPrivate: true, password: 'motdepasse6' },
    { name: 'Channel 7', isPrivate: false },
    { name: 'Channel 8', isPrivate: false },
    { name: 'Channel 9', isPrivate: false },
    { name: 'Channel 10', isPrivate: false },
    { name: 'Channel 11', isPrivate: false },
    { name: 'Channel 12', isPrivate: false }
  ];

  const [priv_msgs, setPriv_msgs] = useState([
    { name: 'User 1'},
    { name: 'User 2'},
    { name: 'User 3'}
]);

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
     console.log("🚀 ~ file: Chat.tsx:190 ~ handleSubmit ~ res:", res)
     // Utilisez la connexion socket pour émettre 'newchannel' avec les informations
     
     socket?.emit('new.channel', res);
     socket?.on('add preview', (data: any) => {
       console.log('data: ', data);
     });
 
     // Fermez la popup après l'envoi
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
                {/* Je n'arrive pas à récupérer les infos saisies dans le popup new channel */}
                {/* Le console.log() de la ligne 190 affiche undefined */}
              </div>
              <div className="channel_div_container">
                {channels.map((channel, index) => (
                  <div className="channel_div" key={index} onClick={() => handleChannelClick(channel.name)}>
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
                  {priv_msgs.map((user, index) => (
                  <div className="channel_div privmsg" key={index} onClick={() => handlePrivMsgClick(user.name)}>
                    <div className="channel_content">
                      <h1 className="channel_title">#{user.name}</h1>
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