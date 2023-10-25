const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'publications',
    port: '3306'
});


module.exports = {
    getUserByUserName:  (username) => {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM Felhasznalo WHERE felhasznalonev=?', [username], function (err, rows) {
                if (!rows) {
                    reject(new Error('Error: rows is undefined'));
                } else {
                    resolve(rows);
                }
            });  
    
        });   
    },
    registerUser: (user, callback) => {
        let payload = {
            felhasznalonev: user.felhasznalonev,
            vezeteknev: user.vezeteknev,
            keresztnev: user.keresztnev,
            email: user.email,
            jelszo: user.jelszo,
            jogosultsag: user.jogosultsag
        };

        connection.query('INSERT INTO Felhasznalo SET ?', payload, (err, rows, fields) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    updateUserDetails: (user, callback) => {

        let payload = {
            felhasznalonev: user.felhasznalonev,
            vezeteknev: user.vezeteknev,
            keresztnev: user.keresztnev,
            email: user.email,
            jelszo: user.jelszo,
            jogosultsag: user.jogosultsag
        };

        connection.query('UPDATE Felhasznalo SET ? WHERE felhasznalonev=?', [payload, user.felhasznalonev], (err, rows, fields) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    deleteUser: (user, callback) => {
        connection.query('DELETE FROM Felhasznalo WHERE felhasznalonev=?', [user.felhasznalonev], (err, rows, fields) => {
            if (err) throw err;
            return callback(err, rows);
        });
    } 

};
