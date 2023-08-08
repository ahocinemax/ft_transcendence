import {Route, Routes, useRoutes} from 'react-router-dom';
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './Start.css';
import Start from './Start'
import Login from './Login'


function App() {
   
    function WithNavbar() 
    {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Start />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </BrowserRouter>
        );
    }

/*     const routes = useRoutes([
		{
			path: '/components/Login',
			element: <Login />,
		},
		{
			path: '/',
			element:
                <Start />,
		},
		{
			path: '/*',
			element:
            <WithNavbar />
		},
	]);
    
    return (
        <BrowserRouter>
            {routes}
        </BrowserRouter>
    ); */
  }

export default Start;
