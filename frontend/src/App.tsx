import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import Profile from './Elements/Profile/Profile';
import Login from './Elements/Login/Login';
import Register from './Elements/Register/Register';

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav id='navBar'>
          <Link to="/">Profile</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>       
        </nav>

        <Routes>
          <Route path="/" index Component={Profile} />
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
        </Routes>
      </div>
    </BrowserRouter>

   
  );
}

export default App;
