import React from 'react';
import { Routes, Route } from 'react-router-dom'; //, Router
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

const socketOptions = {
    transportOptions: { polling: { extraHeaders: { token: localStorage.getItem("userToken"), }, }, },
};

export const socket = io(`${process.env.REACT_APP_BACK_URL}`, socketOptions);
console.log("url: ", `${process.env.REACT_APP_BACK_URL}`);

function App() {
	return (
	<UserContextProvider>
		<SocketContextComponent>
			{/* Vos composants ici */}
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
						<Route path="/checkuser" element={<CheckUser />} />
				</Routes>
			  </div>
			</div>
		</SocketContextComponent>
	</UserContextProvider>
	);
}

export default App;
