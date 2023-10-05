import React, { useState } from 'react';
import './Register.css';

const Register = () => {

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [vezeteknev, setVezeteknev] = useState<string>('');
    const [keresztnev, setKeresztnev] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const register = () => {

    };

    return (
        <div id="registerMain">
            <h1>Register</h1>
            <form>
                <label htmlFor="Username">Felhasznalonév</label>
                <input id='username' value={username} onChange={e => setUsername(e.target.value)} />
                <label htmlFor='vezeteknev'>Vezetéknév</label>
                <input id='vezeteknev' value={username} onChange={e => setUsername(e.target.value)} />
                <label htmlFor='keresztnev'>Keresztnév</label>
                <input id='keresztnev' value={username} onChange={e => setUsername(e.target.value)} />
                <label htmlFor='email'>Email</label>
                <input id='email' value={username} onChange={e => setUsername(e.target.value)} />
                <label htmlFor="Password">Jelszó</label>
                <input id='password' value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={register}>Register</button>
            </form>
        </div>
    )
};

export default Register;