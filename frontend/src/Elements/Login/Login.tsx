import React, { useState } from 'react';
import './Login.css';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Allow-Access-Control-Origin': '*'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        console.log(data);
    }

    return (
        <div id="loginMain">
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" onChange={event => setEmail(event.target.value)} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" onChange={event => setPassword(event.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;