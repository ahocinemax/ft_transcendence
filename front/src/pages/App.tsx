import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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
import CheckUser from './CreateProfile/CheckUser';
import { UserContextProvider } from '../context/userContent';
import SocketContextComponent from '../context/socket';
import { io } from 'socket.io-client';

const socketOptions = { token: localStorage.getItem("userToken") };
console.log("socketOptions: ", socketOptions);

function App() {
    
    const location = useLocation();
    const pathsWithoutSidebar = ['/login', '/create', '/'];
    const shouldRenderSidebar = !pathsWithoutSidebar.includes(location.pathname);

    return (
        <UserContextProvider>
            <SocketContextComponent>
        <div className='app'>
            {shouldRenderSidebar && <Sidebar />}
            <div className='content'>
                <Routes>
                    <Route path="/" element={<Login />} />
                    {/* <Route path="/login" element={<Login />} /> */}
                    <Route path="/start" element={<Start />} />
                    <Route path="/homepage" element={<Homepage />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/gamepage" element={<Gamepage />} />
                    <Route path="/create" element={<CreateProfile />} />
                    <Route path="/checkuser" element={<CheckUser />} />
                </Routes>
            </div>
        </div>
        </SocketContextComponent>
        </UserContextProvider>
    );
}

export default App;
