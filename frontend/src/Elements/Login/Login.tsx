import React, { useEffect, useState } from 'react';
import './Login.css';
import { ReactSession } from 'react-client-session';
import { compareSync } from 'bcrypt-ts';
import { Snackbar, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import SzerzoService from '../../Services/szerzoService';
import { Szerzo } from '../../Models/Szerzo';
import { Jogosultsag } from '../../Enums/Jogosultsag';

const szerzoService = new SzerzoService();

const Login = () => {

    const isLoggedIn = ReactSession.get("isLoggedIn");
    const user = ReactSession.get('user');

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [szerzoNev, setSzerzoNev] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [failedSnacbarOpen, setFailedSnackbarOpen] = useState(false);
    const [szerzoMode, setSzerzoMode] = useState(false);

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    useEffect(() => {
        
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (szerzoMode) {
            const response: Szerzo[] = await szerzoService.getAllSzerzo();
            const data = response.find((szerzo) => szerzo.nev === szerzoNev);
            if (data) {
                if (!isLoggedIn) {
                    setSnackbarOpen(true);
                    ReactSession.set("isLoggedIn", true);
                    ReactSession.set("user", { "id": data.id, "nev": data.nev, "jogosultsag": Jogosultsag.Szerzo });
                    window.location.href = '/';
                }
            }
        } else {
            const headers = { 'Content-Type': 'application/json', 'Allow-Access-Control-Origin': '*'}
            const response = await fetch(`http://localhost:3001/login/?user=${encodeURIComponent(JSON.stringify({ "felhasznalonev": username, "password": password }))}`, {
                method: 'GET',
                headers: headers
            });
            const data = await response.json();
            if (data) {
                if (!isLoggedIn) {
                    if (compareSync(password, data[0].jelszo)) {
                        setSnackbarOpen(true);
                        ReactSession.set("isLoggedIn", true);
                        ReactSession.set("user", data[0]);
                        window.location.href = '/';
                    } else {
                        setFailedSnackbarOpen(true);
                    }
                }
            }
        }
    }

    return (
        <div id="loginMain">
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Sikeres bejelenetkezés!
                </Alert>
            </Snackbar>
            <Snackbar open={failedSnacbarOpen} autoHideDuration={3000} onClose={() => setFailedSnackbarOpen(false)}>
                <Alert onClose={() => setFailedSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    Rossz felhasználónév vagy jelszó!
                </Alert>
            </Snackbar>
            <ToggleButtonGroup
                color="primary"
                id='loginToggle'
                value={szerzoMode}
                exclusive
                onChange={() => setSzerzoMode(!szerzoMode)}
            >
                <ToggleButton value={false}>Felhasználó</ToggleButton>
                <ToggleButton value={true}>Szerző</ToggleButton>
            </ToggleButtonGroup>
            {!szerzoMode && <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input type="username" id="username" onChange={event => setUsername(event.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" onChange={event => setPassword(event.target.value)} />
                    <button type="submit">Login</button>
                </form>
            }
            {szerzoMode && <form onSubmit={handleSubmit}>
                    <label htmlFor="nev">Név</label>
                    <input type="text" id="nev" onChange={event => setSzerzoNev(event.target.value)} />
                    <button type="submit">Login</button>
                </form>
            }
        </div>
    );
}

export default Login;