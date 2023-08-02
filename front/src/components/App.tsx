import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Start from './Start';
import Login from './Login';
import Test from './Test'; // Create a Test component

function App() {
    return (
        <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<Test />} />
        </Routes>
    );
}

export default App;
