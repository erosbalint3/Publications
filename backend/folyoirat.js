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
    getFolyoiratById: (id, callback) => {
        connection.query('SELECT * FROM Folyoirat WHERE id=?', [id], (err, rows) => {
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
    getFolyoiratokBySzerkeszto: (szerkesztoAdmin, callback) => {
        connection.query('SELECT * FROM Folyoirat WHERE szerkeszto = (SELECT felhasznalonev FROM Felhasznalo WHERE felhasznaloNev=? AND jogosultsag="ADMIN")', [szerkesztoAdmin], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    updateFolyoirat: (folyoirat, callback) => {
        connection.query('UPDATE Folyoirat SET ? WHERE id=?', [folyoirat, folyoirat.id], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    deleteFolyoirat: (folyoirat, callback) => {
        connection.query('DELETE FROM Folyoirat WHERE id=?', [folyoirat.id], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    },
    addFolyoirat: (folyoirat, callback) => {
        connection.query('INSERT INTO Folyoirat SET ?', [folyoirat], (err, rows) => {
            if (err) throw err;
            return callback(err, rows);
        });
    }
};