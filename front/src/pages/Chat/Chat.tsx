import React from 'react';
import './Chat.css'; 
import SearchComponent from '../../components/SearchComponent/SearchComponent';

const Chat = () => {

    const handleSearch = (query: string) => {
        // Insérez votre logique de recherche ici
        console.log(`Recherche en cours pour : ${query}`);
      };

      
  return (
    <div className="chat">
        <div className="channel_part">
            <div className="channel_top_div">
                <h1 className="h1">#Channels ([nb])</h1>
            </div>
            <div className="searchbar_div">
            <SearchComponent onSearch={handleSearch} />
            </div>
            <div className="channel_div">
                <h1 className="channel_title">#Channel</h1>
            </div>
            <div className="channel_div">
                <h1 className="channel_title">#Channel</h1>
            </div>
            <div className="channel_div">
                <h1 className="channel_title">#Channel</h1>
            </div>
            <div className="channel_div">
                <h1 className="channel_title">#Channel</h1>
            </div>
            <div className="channel_div">
                <h1 className="channel_title">#Channel</h1>
            </div>
            <div className="channel_div">
                <h1 className="channel_title">#Channel</h1>
            </div>
            <div className="channel_div">
                <h1 className="channel_title">#Channel</h1>
            </div>
            <div className="channel_div">
                <h1 className="channel_title">#Channel</h1>
            </div>
        </div>
		<div className="main_part">
            {/* <div className="Overlay"></div> */}
        </div>
    </div>
  );
}

export default Chat;
