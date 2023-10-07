import React, { useState, useEffect, useCallback }  from 'react';
import './Chat.css'; 
import SearchComponent from './../components/SearchComponent/SearchComponent';
import io from 'socket.io-client';
import { NewChannel } from './chat/newChannel';

const socket = io('http://localhost:4000');

const Chat = () => {
    const [num] =  useState(0);
    const [showFaceFlag, setShowFaceFlag] = useState(true);
    const [inputText, setInputText] = useState('');
    const [chatLog, setChatLog] = useState<string[]>([]);
    const [msg, setMsg] = useState('');
    const [updateStatus, setUpdateStatus] = useState(0);
    const [channelName, setChannelName] = useState('');
    const [newChannelRequest, setNewChannelRequest] = useState(true);

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

    const newChannelDisappear = () => {
        setNewChannelRequest(old => {return !old})
    }

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
        <div
          onClick={newChannelDisappear}
          className="card-disappear-click-zone"
          style={{
            display: newChannelRequest ? '' : 'none',
            backgroundColor: 'pink',
          }}>
        <div 
            className="add-zone"
            // prevent event to propagate to the parent
            onClick={event => event.stopPropagation()}>
              <NewChannel
                newChannelRequest={newChannelRequest}
                onNewChannelRequest={() => {
                  setNewChannelRequest(old => {return !old})
                }}
                updateStatus={updateStatus}
              />
          </div>
        </div>
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
