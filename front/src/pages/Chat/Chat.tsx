import React, { useState, useContext, useEffect } from 'react';
import './Chat.css'; 
import SearchComponent from '../../components/SearchComponent/SearchComponent';
import ChannelNamePopup from '../../components/channel_name_popup/channel_name_popup';
import PrivateChanPopup from '../../components/Private_chan_popup/private_chan_popup';
import SocketContext from '../../context/socketContext';
import { backFunctions } from '../../outils_back/BackFunctions';
import UserContext, { Email } from '../../context/userContent';
import { channelModel } from '../../interface/global';
import { userModel } from '../../interface/global';
import { useNavigate } from 'react-router-dom';
import { RoomID, useUserContext } from '../../context/userContent';

const userInfoInit = {
  id: 0,
  name: "",
  image: "",
  friends: [],
  blocked: [],
  gamesLost: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  rank: 0,
  score: 0,
  winRate: 0,
};

const initializeUser = async (result: any, setUserInfo: any) => {
  const friendList = await backFunctions.getFriend(result.name);
  const blockedList = await backFunctions.getBlockedUser(result.name);
  userInfoInit.id = result.id;
  userInfoInit.name = result.name;
  userInfoInit.image = result.image;
  userInfoInit.friends = friendList;
  userInfoInit.blocked = blockedList;
  userInfoInit.gamesLost = result.gamesLost;
  userInfoInit.gamesPlayed = result.gamesPlayed;
  userInfoInit.gamesWon = result.gamesWon;
  userInfoInit.rank = result.rank;
  userInfoInit.score = result.score;
  userInfoInit.winRate = result.winRate === null ? 0 : result.winRate;
  setUserInfo(userInfoInit);
};

const Chat = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUserPopupVisible, setIsUserPopupVisible] = useState(false);

  // Etat pour les channels publics
  const [channels, setChannels] = useState<channelModelList>([]); // liste des channels publics
  const [messagesData, setMessagesData] = useState<MessagesArray>([]); // messages du channel public actif
  const [channelName, setChannelName] = useState(''); // nom du channel public pour création
  const [privatePassword, setPrivatePassword] = useState(''); // mot de passe saisi par l'utilisateur
  const [PasswordNeeded, setPassword] = useState(false); // faut il un mot de passe (booléen)

  // Etat pour les channels privés
  const [priv_msgs, setPriv_msgs] = useState<channelModelList>([]); // liste des channels privés
  const [privateMessagesData, setPrivateMessagesData] = useState<MessagesArray>([]); // messages du channel privé actif
  const [activePrivateChannel, setActivePrivateChannel] = useState(0);
  const [mpInfos, setMpInfos] = useState<channelModel>(); // nom du channel privé

  // Commun aux deux
  const [messageInput, setMessageInput] = useState(''); // message en cours de frappe
  const [selectedUser, setSelectedUser] = useState(''); // le client a cliqué sur ce nom d'utilisateur
  const [selectedUserImage, setSelectedUserImage] = useState(''); // image de l'utilisateur sélectionné
  const [tempActiveChannel, setTempActiveChannel] = useState(0); // canal sur lequel le client a cliqué
  const [activeChannel, setActiveChannel] = useState(0);
  
  // Duel request
  const [displayWaiting, setDisplayWaiting] = useState(false); // should open a pupup with a waiting animation
  const [displayClose, setDisplayClose] = useState(true);
  const [textToDisplay, setTextToDisplay] = useState("Waiting for response...");
  const [mode, setMode] = useState('');
  const [selectedUserID, setSelectedUserID] = useState(0);

  const { socket, users } = useContext(SocketContext).SocketState;
  const userInfos = useContext(UserContext);
  const [userInfo, setUserInfo] = useState<any>(userInfoInit);
  const [isFetched, setIsFetched] = useState(false);
  
  //get role d'utilisateur
  const [userRole, setUserRole] = useState('member');

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userToken"))
      navigate("/");
  }, []);


  const formatDate = (date: Date) => {
    const datePart = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  
    const timePart = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    return `${datePart} ${timePart}`;
  };

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
    name: string;
  };

  type MessagesArray = MessageData[];

  type channelModelList = channelModel[];

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitBeforeRedirection(url: string) {
    await sleep(2580); // Pause de 2 secondes
    navigate(url);
  }

  async function waitBeforeClose() {
    await sleep(2580); // Pause de 2 secondes
    setDisplayClose(false);
    setDisplayWaiting(false);
  }

  const {
    roomID,
    setRoomID,
	} = useUserContext();

  // HOOKS

  useEffect(() => { // Handle events : 'fetch channels', 'fetch mp'
    const fetchIsUser = async () => {
      let result;
      if (!isFetched && userInfos.userName.userName !== undefined) {
        result = await backFunctions.getUserByToken();
        if (result === undefined) return ;
        await initializeUser(result, setUserInfo);
        setIsFetched(true);
      }
    };
    fetchIsUser();
    // Send channel list request
    socket?.emit('get channels', userInfos.email.email, (data: any) => {}); // 1st load of channels
    socket?.on('fetch channels', (data: channelModel[]) => {
      data = !Array.isArray(data) ? Array.from(data) : data;
      setChannels(data);
      if (tempActiveChannel != 0) setActiveChannel(tempActiveChannel);
      setTempActiveChannel(0);
    });

    // Send MP list request
    socket?.emit('get mp', userInfos.email.email);
    socket?.on('fetch mp', (data: channelModel[]) => {
      data = !Array.isArray(data) ? Array.from(data) : data;
      setPriv_msgs(data);
    });
    socket?.on('duel response', (data: any) => {
      if (data.response === true) setTextToDisplay(`Request accepted. Creating lobby with ${data.name}`);
      else setTextToDisplay(`Request declined by ${data.name}.`);
      waitBeforeClose();
    });
    socket?.on("get room id", (response: {id: number, name: string}) => {
      setDisplayClose(false);
      const roomID: RoomID = {roomID: response.name};
      setRoomID(roomID);
      waitBeforeRedirection('/gamepage');
    });
    return () => {
      socket?.off('fetch mp');
      socket?.off('fetch channels');
      socket?.off('duel response');
      socket?.off("get room id");
    };
  }, [socket]);

  useEffect(() => { // handle events : 'fetch message', 'update requests'
    if (activeChannel && socket) {
      socket.emit('get messages', activeChannel, (data: any) => {});
      socket?.emit('get role', activeChannel)
  }
    else if (activePrivateChannel && socket) socket.emit('get messages', activePrivateChannel, (data: any) => {});
    socket?.on('fetch messages', (updatedMessagesData) => { // Just clicked on chan, must fetch messages
        setMessagesData(updatedMessagesData);
        setPrivateMessagesData(updatedMessagesData);
    });
    socket?.on('update private request', () => {
      socket?.emit('get mp', userInfos.email.email);
    });
    socket?.on('update message request', () => {
      if (activeChannel) socket?.emit('get messages', activeChannel);
      else if (activePrivateChannel) socket?.emit('get messages', activePrivateChannel);
    });
    socket?.on('update channel request', () => {
      socket?.emit('get channels');
    });
    socket?.on('new channel id', (channelId: number) => {
      setTempActiveChannel(channelId);
    });
    return () => {
      socket?.off('fetch messages');
      socket?.off('update private request');
      socket?.off('update message request');
      socket?.off('update channel request');
      socket?.off('new channel id');
    };
  }, [activeChannel, activePrivateChannel, socket]);

  useEffect(() => {
    if (mode === '') return;
    socket?.emit("duel request", selectedUserID, selectedUser, mode);
  }, [socket, mode]);

/**
 * Envoie au back une demande d'inscription en tant que membre sur le channel
 * socket?.emit('register to channel', <channelId>);
 * 
 * Envoie au back une demande de désinscription du channel
 * socket?.emit('leave channel', <channelId>);
 * 
 * Vérifie si le mot de passe saisi correspond à celui du channel demandé
 * socket?.emit('check password', <channelId>, <password>, (data: boolean) => {
 *   <code here>
 * });
 * le callback reçpot true si le mot de passe est correct, false sinon
 */

  // EVENT HANDLERS
  const handleSearch = (query: string) => {
    console.log(`Recherche en cours pour : ${query}`);
  };

  // handle create new channel component
  const handleSubmit = (res: any) => {
    const data = {
      name: res.channelName,
      dm: false,
      password: res.password,
      email: userInfos.email.email,
      isProtected: res.private
    };
    socket?.emit('new channel', data);
  }

  const onClose = () => {
    setDisplayWaiting(false);
    socket?.emit("remove duel request", userInfos.userId.userId);
    setMode("");
  }

  const handleDuelRequest = () => {
    // check if requested user is connected
    if (users.find((user: string) => user === selectedUser) !== undefined)
    {
      setDisplayWaiting(true);
      setDisplayClose(true);
    }
  }
  const handleChannelClick = (channelId: number) => {
    if (PasswordNeeded)
        return;
    const channel: channelModel|undefined = channels.find((c: any) => c.id === channelId);
    if (channel && channel.isProtected)
    {
      // Salon privé, demandez le mot de passe d'abord
        setTempActiveChannel(channelId);
        // Ensuite, activez le mot de passe
        setChannelName(channel.name);
        setPassword(true);
    } else {
      // Salon public, accédez directement
      setActiveChannel(channelId);
      setChannelName(channel? channel.name : '');
      setActivePrivateChannel(0);
    }
    setMpInfos(undefined);
  };

  const handlePrivMsgClick = (channelId: number) => {
    const channel: channelModel | undefined = priv_msgs.find((c: any) => c.id === channelId);
    if (!channel) return;
    setMpInfos(channel);
    console.log("🚀 ~ file: Chat.tsx:295 ~ handlePrivMsgClick ~ channel:", channel)
    setChannelName(channel.name);
    setActiveChannel(0);
    setActivePrivateChannel(channelId);
  };

  const addPrivateUser = (userName: string) => {
    const data: any = {
      name: userName,
      dm: true,
      email: userInfos.email.email,
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
      
    } else if (activePrivateChannel) {
      // send private message to backend
      socket?.emit('new message', {
        channelId: activePrivateChannel,
        message: newMessage.content,
        email: userInfos.email.email
      });
    }
    setMessageInput('');
  };

  const handleUserClick = async (userName: string, userID: number) => {
    if (userInfos.userName.userName == userName)
        return;
    setSelectedUser(userName);
    setSelectedUserID(userID);
    setSelectedUserImage(await backFunctions.getImage(userName));
    setIsUserPopupVisible(true);
  };

  const closeUserPopup = () => {
    setSelectedUser('');
    setSelectedUserID(0);
    setSelectedUserImage('');
    setIsUserPopupVisible(false);
  };

useEffect(() => {
  if (socket) {
    socket.on('password check result', (isPasswordCorrect: boolean) => {
      console.log('isPasswordCorrect', isPasswordCorrect);
      if (isPasswordCorrect) {
        console.log('Password is correct');
        setPassword(false);
        setActiveChannel(tempActiveChannel);
        setTempActiveChannel(0);
      } else {
        console.log('Password is not correct');
      }
    });
  }
}, [socket, tempActiveChannel]);


  const handlePasswordSubmit = (password: string) => {
    const channel = channels.find((c: any) => c.id === tempActiveChannel);
    if (channel && socket) {
      socket.emit('check password', channel.id, password);
    }
  };

  useEffect(() => {// recuperer le role d'utilisateur
    if (activeChannel && socket) {
      socket.emit('get roles', [activeChannel]);
    }
    socket?.on('fetch roles', (role) => {
      setUserRole(role); //set le role d'utilisateur
      console.log('users role: ', role);
    });
    return () => {
      socket?.off('fetch roles');
    };
  }, [activeChannel, socket]);

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

  const check_user = (email: string): boolean => {
    return email === userInfos.email.email;
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
                    {channel.isProtected && (
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
        {activeChannel ? (
          <div className="message_list">
              <h1 className="channel_title active_channel_title">#{channelName}</h1>
          <ul>
          {activeChannel && messagesData && messagesData.map((message: MessageData, index: number) => {
              const textColor = check_user(message.email) ? "#8f35de" : "#275ec4";//"#8f35de" : "#275ec4"
              return (
                <li key={index}>
                  <div
                    className={`message_bubble ${message.name !== userInfos.userName.userName ? 'user' : 'not_user'}`}
                    style={{
                      width: `${Math.min(100, message.message.length)}%`, // Adjust the maximum width as needed
                    }}
                  >
                    {selectedUser !== userInfos.userName.userName ? (
                      <span
                        className="message_sender"
                        onClick={() => handleUserClick(message.name, message.id)}
                        style={{color: textColor}}
                      >
                        <strong>{message.name} </strong>
                      </span>
                    ) : (
                      <span className="message_sender" style={{color: textColor}}>
                        <strong>{message.name} </strong>
                      </span>
                    )}
                    <span style={{color: '#c0b9c7'}}>
                        ({formatDate(new Date(message.createAt))}):&nbsp;
                    </span>
                    {message.message}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        ) : null}
        {activeChannel ? (
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="send_msg"
            />
          </form>
        ) : null} 
        {activePrivateChannel ? (
        <div className="message_list">
          <h1 className="channel_title active_channel_title">#{mpInfos?.name}</h1>
          <ul>
            {privateMessagesData && privateMessagesData.map((message: MessageData, index: number) => (
              <li key={index}>
                <div
                    className={`message_bubble ${message.name !== userInfos.userName.userName ? 'user' : 'not_user'}`}
                  style={{
                    width: `${Math.min(100, message.message.length)}%`, // Adjust the maximum width as needed
                  }}
                >
                  <span
                    className="message_sender"
                    onClick={() => handleUserClick(message.name, message.id)} // Gérer le clic sur le nom de l'utilisateur
                  >
                    <strong>{message.name} </strong>
                  </span>
                  <span style={{color: '#c0b9c7'}}>
                    ({formatDate(new Date(message.createAt))}):&nbsp;
                  </span>
                  {message.message}
                </div>
              </li>
            ))}
          </ul>
        </div>
        ) : null}
        {activePrivateChannel ? (
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Message"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="send_msg"
              />
            </form>
        ) : null}
      </div>
      <div className={`user_popup ${isUserPopupVisible && selectedUser ? 'visible' : ''}`}>
        <div className="close_button" onClick={closeUserPopup}>
          X
        </div>
        <div className="popup_content">
    <p className="user_popup_name">{selectedUser}</p>
    <img src={selectedUserImage} alt="User Avatar" className="img_popup1"/>
    <div className="chat_button_container">
        <div className="chat_buttons DUEL" onClick={handleDuelRequest}></div>
        <div className="chat_buttons MSG" onClick={() => addPrivateUser(selectedUser)}></div>
        <div className="chat_buttons ADD_FRIEND" onClick={() => backFunctions.addFriend(userInfos.userName.userName, selectedUser, userInfos)}></div>
        <div className="chat_buttons BLOCK"  onClick={() => backFunctions.blockUser(userInfos.userName.userName, selectedUser, userInfos)}></div>
        {userRole === 'admin' || userRole === 'owner' ? (
                <div className="chat_button_container">
                <div className="chat_buttons PROMOTE"onClick={() => backFunctions.addNewAdminUser(userInfos.userName.userName, selectedUser, {channelId : activeChannel })}></div>
                <div className="chat_buttons MUTE"onClick={() => backFunctions.addMute(userInfos.userName.userName, selectedUser, {channelId : activeChannel })}></div>
                <div className="chat_buttons KICK"onClick={() => backFunctions.kickUser(userInfos.userName.userName, selectedUser, activeChannel)}></div>
                <div className="chat_buttons BAN"onClick={() => backFunctions.banUser(userInfos.userName.userName, selectedUser, {channelId : activeChannel })}></div>
            </div>
        ) : null}
      </div>
      </div>
      </div>
      {displayWaiting && (
      <div className="waiting_popup">
        <div className="waiting_popup_container">
          {displayClose && (<span className="popup_close" onClick={onClose}>
            &times;
          </span>)}
          {mode !== '' ?
          (<div>
            <h1 className="game_mode_title">{mode}</h1>
            <h2 className="h1_popup_waiting">{textToDisplay}</h2>
          </div>) :
          (<div>
            <h1 className="game_mode_title">Choose a game mode</h1>
            <div className="game_mode_container">
              <div className="game_mode normal" onClick={() => {setMode("normal");}}>Normal</div>
              <div className="game_mode hard" onClick={() => {setMode("hard");}}>Hard</div>
              <div className="game_mode hardcore" onClick={() => {setMode("hardcore");}}>Hardcore</div>
            </div>
          </div>
          )}
          {mode !== '' && displayClose && <div className="pong-animation">
            <div className="player player1"></div>
            <div className="player player2"></div>
            <div className="ball-animation"></div>
          </div>}
        </div>
      </div>
      )}
    </div>
  );
}

export default Chat;