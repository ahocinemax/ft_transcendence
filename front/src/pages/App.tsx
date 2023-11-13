import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Start from './Start/Start';
import Login from './Login/Login';
import Homepage from './Homepage/Homepage';
import Sidebar from './Sidebar/Sidebar';
import Leaderboard from './Leaderboard/Leaderboard';
import Chat from './Chat/Chat';
import Profile from './Profile/Profile';
import FriendProfile from './FriendProfile/FriendProfile';
import Settings from './Settings/Settings';
import Gamepage from './Gamepage/Gamepage';
import CreateProfile from './CreateProfile/CreateProfile';
import CheckUser from './CreateProfile/CheckUser';
import { useContext, useEffect, useState } from 'react';
import { UserContextProvider } from '../context/userContent';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import SocketContextComponent from '../context/socket';

const socketOptions = { token: localStorage.getItem("userToken") };
console.log("Token: ", socketOptions.token);

function App() {
    
    const location = useLocation();
    const pathsWithoutSidebar = ['/login', '/create', '/'];
    const shouldRenderSidebar = !pathsWithoutSidebar.includes(location.pathname);
    const [isInvite, setIsInvite] = useState(false);
    const isAuthenticated = () => {
        const token = socketOptions.token;
        // console.log("!!token : ", !!token)
        // console.log(token);
        return !!token;
    };
        
    return (
        <UserContextProvider>
            <SocketContextComponent>
                <div className='app'>
                    {shouldRenderSidebar && <Sidebar />}
                    <div className='content'>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            {/* <Route element={<PrivateRoute isAuthenticated={isAuthenticated()} />}> */}
                                <Route path="/start" element={<Start />} />
                                <Route path="/homepage" element={<Homepage />} />
                                <Route path="/leaderboard" element={<Leaderboard />} />
                                <Route path="/chat" element={<Chat />} />
                                <Route path="/profile" element={<Profile />} />
                                {/* <Route path="/friendprofile" element={<FriendProfile />} /> */}
                                <Route path="/profile/:friendName" element={<FriendProfile />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/gamepage" element={<Gamepage />} />
                                <Route path="/create" element={<CreateProfile />} />
                                <Route path="/checkuser" element={<CheckUser />} />
                           {/*  </Route> */}
                        </Routes>
                    </div>
                </div>
            </SocketContextComponent>
        </UserContextProvider>
    );
}

export default App;
