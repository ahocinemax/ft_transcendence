import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import Start from './Start/Start';
import Login from './Login/Login';
import Homepage from './Homepage/Homepage';
import Sidebar from './Sidebar/Sidebar';
import Leaderboard from './Leaderboard/Leaderboard';
import Chat from './Chat/Chat';
import Profile from './Profile/Profile';
import Settings from './Settings/Settings';
import Gamepage from './Gamepage/Gamepage';
import CreateProfile from './CreateProfile/CreateProfile';
import { io } from "socket.io-client";

const socketOptions = {
    transportOptions: { polling: { extraHeaders: { token: localStorage.getItem("userToken"), }, }, },
};

export const socket = io(`${process.env.REACT_APP_BACK_URL}`, socketOptions);

function App() {
    return (
        <div className='app'>
            <Sidebar />
            <div className='content'>
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/homepage" element={<Homepage />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/gamepage" element={<Gamepage />} />
                    <Route path="/create" element={<CreateProfile />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
