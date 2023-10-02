import React from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import Start from './Start';
import Login from './Login';
import Homepage from './Homepage';
import Sidebar from './Sidebar';
import Leaderboard from './Leaderboard';
import Chat from './Chat';
import Profile from './Profile';
import Settings from './Settings';
import Gamepage from './Gamepage';
import CreateProfile from './CreateProfile';

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
