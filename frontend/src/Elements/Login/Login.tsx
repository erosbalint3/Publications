import React, { useState } from 'react';
import './Login.css';
import { ReactSession } from 'react-client-session';
import { compareSync } from 'bcrypt-ts';

const Login = () => {

    const isLoggedIn = ReactSession.get("isLoggedIn");
    const user = ReactSession.get('user');

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const headers = { 'Content-Type': 'application/json', 'Allow-Access-Control-Origin': '*'}
        const response = await fetch(`http://localhost:3001/login/?user=${encodeURIComponent(JSON.stringify({ "felhasznalonev": username, "password": password }))}`, {
            method: 'GET',
            headers: headers
        });
        const data = await response.json();
        if (data) {
            if (!isLoggedIn) {
                if (compareSync(password, data[0].jelszo)) {
                    ReactSession.set("isLoggedIn", true);
                    ReactSession.set("user", data[0]);
                    window.location.href = '/kozlemenyek';
                }
            }
        }
        console.log(data);
    }

    return (
        <div id="loginMain">
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="username" id="username" onChange={event => setUsername(event.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={event => setPassword(event.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;