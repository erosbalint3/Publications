import React, { useState } from 'react';
import UserService from '../../Services/userService';
import './Register.css';
import { Jogosultsag } from '../../Enums/Jogosultsag';
import { genSaltSync, hash, hashSync } from "bcrypt-ts";

const Register = () => {

    const userService = new UserService();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [vezeteknev, setVezeteknev] = useState<string>('');
    const [keresztnev, setKeresztnev] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const register = () => {
        const hashedPassword = hashSync(password, genSaltSync(10));
        userService.registerUser({
            felhasznalonev: username, 
            vezeteknev: vezeteknev,
            keresztnev: keresztnev,
            email: email,
            jelszo: hashedPassword,
            jogosultsag:Jogosultsag.Kutato
        });
        window.location.href = '/login';
    };

    return (
        <div id="registerMain">
            <h1>Register</h1>
            <div id='formDiv'>
                <label htmlFor="Username">Felhasznalonév</label>
                <input id='username' value={username} onChange={e => setUsername(e.target.value)} />
                <label htmlFor='vezeteknev'>Vezetéknév</label>
                <input id='vezeteknev' value={vezeteknev} onChange={e => setVezeteknev(e.target.value)} />
                <label htmlFor='keresztnev'>Keresztnév</label>
                <input id='keresztnev' value={keresztnev} onChange={e => setKeresztnev(e.target.value)} />
                <label htmlFor='email'>Email</label>
                <input id='email' value={email} onChange={e => setEmail(e.target.value)} />
                <label htmlFor="Password">Jelszó</label>
                <input type='password' id='password' value={password} onChange={e => setPassword(e.target.value)} />
                <button onClick={register}>Register</button>
            </div>
        </div>
    )
};

export default Register;