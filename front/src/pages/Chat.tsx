/*
    chat version Stive
*/

/*
import React from 'react';
import './Chat.css'; 
import SearchComponent from './components/SearchComponent';

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
            {/* <div className="Overlay"></div> }
        </div>
    </div>
  );
}

export default Chat;

    Chat version Mariko
*/
import React, { useState, useEffect, useCallback }  from 'react';
import './Chat.css'; 
import SearchComponent from './components/SearchComponent';
import io from 'socket.io-client';
import { Tag, newChannel } from "./chat/chat.type";

const socket = io('http://localhost:4000');
console.log(socket);

const Chat = () => {
    const [num] =  useState(0);
    const [showFaceFlag, setShowFaceFlag] = useState(true);
    const [inputText, setInputText] = useState('');
    const [chatLog, setChatLog] = useState<string[]>([]);
    const [msg, setMsg] = useState('');
    const [channelName, setChannelName] = useState('');
    const [newChannelId, setNewChannelId] = useState('');

    const handleSearch = (query: string) => {
        // Insérez votre logique de recherche ici
        console.log(`Recherche en cours pour : ${query}`);
      };

      useEffect(() => {
        if (num % 3 === 0 && !showFaceFlag) {
          setShowFaceFlag(true);
        } else if (num % 3 !== 0 && showFaceFlag) {
          setShowFaceFlag(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [num]);

    useEffect(() => {
        socket.on('connect', () => {
          // eslint-disable-next-line no-console
          console.log('connection ID : ', socket.id);
        });
      }, []);
      
      useEffect(() => {
        socket.on('test', () => {
          // eslint-disable-next-line no-console
          console.log('teest test teeeest : ', socket.id);
        });
      }, []);

      useEffect(() => {
        socket.on('disconnect', () => {
          // eslint-disable-next-line no-console
          console.log('disconnect!!!! : ', socket.id);
        });
      }, []);      
    
    const onClickSubmit = useCallback(() => {
        console.log(`Sending message: ${inputText}`); 
        socket.emit('message', inputText);
    }, [inputText]);


    useEffect(() => {
        socket.on('message', (message: string) => {
          console.log('recieved : ', message);
          setMsg(message);
        });
      }, []); 
    
      useEffect(() => {
        setChatLog(ChatLog => [...ChatLog, msg]);
      }, [msg]);

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
                {/*  */}
                <div className="chat_content">
                    <input
                        id="inputText"
                        type="text"
                        value={inputText}
                        onChange={(event) => {
                            setInputText(event.target.value);
                        }}
                        />
                    <input id="sendButton" onClick={onClickSubmit} type="submit" />
                    {chatLog.map((message, index) => (
                    <p key={index}>{message}</p>
                    ))}
                </div>
            </div>
    </div>
  );
}

export default Chat;
