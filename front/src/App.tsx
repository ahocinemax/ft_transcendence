import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <form method='post'>
          <label>Login</label>
          <input type="text" />
          <br></br>
          <label>Password</label>
          <input type="password" />
          <br></br>
          <button type="submit">Submit</button>
          
        </form>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
