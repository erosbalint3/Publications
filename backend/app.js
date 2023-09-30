const express = require('express');
const mysql = require('mysql');
const user = require('./user.js');

const app = express();
const port = 3000;
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'publications',
    port: '3306'
});

let registeredUser = null;

let us = {
    felhasznalonev: 'jozsi',
    vezeteknev: 'igen',
    keresztnev: 'nem',
    email: 'igen@gmail.com',
    jelszo: '1234567',
    jogosultsag: 'ADMIN'
};

user.getUserByUserName('jozsi')
    .then((results) => {
        registeredUser = results[0];
        console.log(registeredUser);
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(port, () => {
    console.log(`this app runs in port: ${port}`);
})