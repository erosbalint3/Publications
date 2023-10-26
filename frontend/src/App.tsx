import React, { useState } from 'react';
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
import { ReactSession } from 'react-client-session';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Acceptance from './Elements/Acceptance/Acceptance';


function App() {
  ReactSession.setStoreType("localStorage");

  const user = ReactSession.get('user');

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  return (
      <BrowserRouter>
        <div>
          <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}>
              <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                  Sikeres Kijelentkezés!
              </Alert>
          </Snackbar>
          <nav id='navBar'>
            <Link to="/">Profile</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/kozlemenyek">Közlemények</Link>   
            <Link to="/szerzok">Szerzők</Link>    
            <Link to="/kiadok">Kiadók</Link>
            <Link to="/folyoiratok">Folyóiratok</Link>
            {user?.jogosultsag == "ADMIN" && <Link to='/jovahagyas'>Közlemények jóváhagyása</Link>}
            <Link to="#" onClick={async () => {
              ReactSession.set("isLoggedIn", false);
              ReactSession.set("user", null); 
              setSnackbarOpen(true);
              await delay(2000);
              window.location.href = '/login';
            }}>Kijelentkezés</Link>
          </nav>

          <Routes>
            <Route path="/" index Component={Profile} />
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />
            <Route path="/kozlemenyek" Component={Kozlemenyek} />
            <Route path="/szerzok" Component={Szerzok} />
            <Route path="/kiadok" Component={Kiadok} />
            <Route path="/folyoiratok" Component={Folyoiratok!} />
            <Route path='/jovahagyas' Component={Acceptance!} />
          </Routes>
        </div>
      </BrowserRouter>

   
  );
}

export default App;
