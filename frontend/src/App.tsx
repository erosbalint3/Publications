import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom';
import Profile from './Elements/Profile/Profile';
import Login from './Elements/Login/Login';
import Register from './Elements/Register/Register';
import Kozlemenyek from './Elements/Kozlemenyek/Kozlemenyek';
import Szerzok from './Elements/Szerzok/Szerzok';
import Kiadok from './Elements/Kiadok/Kiadok';
import Folyoiratok from './Elements/Folyoiratok/Folyoiratok';


function App() {
  return (
    <BrowserRouter>
      <div>
        <nav id='navBar'>
          <Link to="/">Profile</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/kozlemenyek">Közlemények</Link>   
          <Link to="/szerzok">Szerzők</Link>    
          <Link to="/kiadok">Kiadók</Link>
          <Link to="/folyoiratok">Folyóiratok</Link>
        </nav>

        <Routes>
          <Route path="/" index Component={Profile} />
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/kozlemenyek" Component={Kozlemenyek} />
          <Route path="/szerzok" Component={Szerzok} />
          <Route path="/kiadok" Component={Kiadok} />
          <Route path="/folyoiratok" Component={Folyoiratok} />
        </Routes>
      </div>
    </BrowserRouter>

   
  );
}

export default App;
