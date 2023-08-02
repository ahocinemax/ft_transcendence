import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Start from './Start';
import Login from './Login';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
