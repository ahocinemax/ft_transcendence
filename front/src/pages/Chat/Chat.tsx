import React, { useState } from 'react';
import './Chat.css'; 
import SearchComponent from '../../components/SearchComponent/SearchComponent';
import ChannelNamePopup from '../../components/channel_name_popup/channel_name_popup'; // Import your ChannelNamePopup component


const Chat = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleSearch = (query: string) => 
    {
    // Insérer logique de recherche ici
    console.log(`Recherche en cours pour : ${query}`);
  };

  /* Récupérer ici tous les channels de notre base de données sous forme d'array*/
  const channels = [
    { name: 'Channel 1', isPrivate: false },
    { name: 'Channel 2', isPrivate: true },
    { name: 'Channel 3', isPrivate: false },
    { name: 'Channel 4', isPrivate: false },
    { name: 'Channel 5', isPrivate: true },
    { name: 'Channel 6', isPrivate: true },
    { name: 'Channel 7', isPrivate: false },
    { name: 'Channel 8', isPrivate: false },
    { name: 'Channel 9', isPrivate: false },
    { name: 'Channel 10', isPrivate: false },
    { name: 'Channel 11', isPrivate: false },
    { name: 'Channel 12', isPrivate: false }
  ];

  const createChannel = () => 
  {
    /* Fonction back pour créer un channel */
    setIsPopupOpen(true);
  }

  const closePopup = () => 
  {
    // Close the pop-up
    if (isPopupOpen)
      setIsPopupOpen(false);
  };

  return (
    <div className="chat" onClick={closePopup}>
      <div className="channel_part">
        <div className="searchbar_div">
          <SearchComponent onSearch={handleSearch} />
        </div>
        <div className="channel_top_div">
          <h1 className="h1">#Channels ([nb])</h1>
          <h1 className="createchan" onClick={createChannel}>+</h1>
          {isPopupOpen && <ChannelNamePopup onClose={closePopup} />} {/* Render the ChannelNamePopup component when isPopupOpen is true */}
        </div>
        <div className="channel_div_container">
          {channels.map((channel, index) => (
            <div className="channel_div" key={index}>
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
      <div className="main_part">
        {/* <div className="Overlay"></div> */}
      </div>
    </div>
  );
}

export default Chat;
