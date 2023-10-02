const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'publications',
    port: '3306'
});

module.exports = {
    getAllKiado: (callback) => {
        connection.query('SELECT * FROM Kiado', (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    getKiadoByName: (kiado_nev, callback) => {
        connection.query('SELECT * FROM Kiado WHERE nev =?', [kiado_nev], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    updateKiado: (kiado, callback) => {
        connection.query('UPDATE Kiado SET ? WHERE nev=?', [kiado, kiado.nev], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    deleteKiado: (kiado, callback) => {
        connection.query('DELETE FROM Kiado WHERE nev=?', [kiado.nev], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    addKiado: (kiado, callback) => {
        connection.query('INSERT INTO Kiado SET ?', [kiado], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    }
};