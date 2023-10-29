const { query } = require('express');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'publications',
    port: '3306'
});

module.exports = {
    getAllSzerzo: (callback) => {
        connection.query('SELECT * FROM Szerzo', (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    getSzerzoByKozlemeny: (kozlemeny, callback) => {
        connection.query('SELECT DISTINCT Szerzo.nev FROM Szerzo, szerzoi, Kozlemeny WHERE szerzoi.szerzo_id = Szerzo.id AND szerzoi.kozl_id = Kozlemeny.id AND Kozlemeny.id=?', [kozlemeny], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    updateSzerzo: (szerzo, callback) => {
        connection.query('UPDATE Szerzo SET ? WHERE id=?', [szerzo, szerzo.id], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    deleteSzerzo: (szerzo, callback) => {
        connection.query('DELETE FROM Szerzo WHERE id=?', [szerzo.id], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    addSzerzo: (szerzo, callback) => {
        connection.query('INSERT INTO Szerzo SET ?', [szerzo], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    }
};