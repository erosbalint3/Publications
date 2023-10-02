const express = require('express');
const mysql = require('mysql');
const user = require('./user.js');
const kozlemeny = require('./kozlemeny.js');

const app = express();
const port = 3000;

let registeredUser = null;

user.getUserByUserName('jozsi')
    .then((results) => {
        registeredUser = results[0];
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(port, () => {
    console.log(`this app runs in port: ${port}`);
})