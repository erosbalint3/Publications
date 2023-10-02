const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'publications',
    port: '3306'
});

module.exports = {
    getAllFolyoirat: (callback) => {
        connection.query('SELECT * FROM Folyoirat', (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    getFolyoiratokByKiado: (kiado_nev, callback) => {
        connection.query('SELECT * FROM Folyoirat WHERE Folyoirat.kiado =?', [kiado_nev], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    getFolyoiratokByKozlemeny: (kozlemeny, callback) => {
        connection.query('SELECT * FROM Folyoirat WHERE id=?', [kozlemeny.folyoirat_azon], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    getFolyoiratBySzerkeszto: (szerkesztoAdmin, callback) => {
        connection.query('SELECT * FROM Kozlemeny, Szerzo, szerzoi WHERE Kozlemeny.id = szerzoi.kozl_id AND szerzoi.szerzo_id = Szerzo.id AND Szerzo.nev =?', [nev], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    updateKozlemeny: (kozlemeny, callback) => {
        connection.query('UPDATE Kozlemeny SET ? WHERE id=?', [kozlemeny, kozlemeny.id], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    deleteKozlemeny: (kozlemeny, callback) => {
        connection.query('DELETE FROM Kozlemeny WHERE id=?', [kozlemeny.id], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    addKozlemeny: (kozlemeny, callback) => {
        connection.query('INSERT INTO Kozlemeny SET ?', [kozlemeny], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    }
};