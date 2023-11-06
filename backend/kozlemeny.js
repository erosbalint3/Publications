const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'publications',
    port: '3306',
});

module.exports = {
    getAllKozlemeny: (callback) => {
        connection.query('SELECT * FROM Kozlemeny WHERE elfogadva=1', (err, rows) => {
            return callback(err, rows);
        });
    },
    getKozlemenyById: (id, callback) => {
        connection.query('SELECT * FROM Kozlemeny WHERE id=?', [id], (err, rows) => {
            return callback(err, rows);
        });
    },
    getKozlemenyByFolyoirat: (folyoirat_azon, callback) => {
        connection.query('SELECT * FROM Kozlemeny WHERE folyoirat_azon=?', [folyoirat_azon], (err, rows) => {
            return callback(err, rows);
        });
    },
    getUsersKozlemenyek: (felhasznalonev, callback) => {
        connection.query('SELECT * FROM Kozlemeny WHERE felhasznalonev=?', [felhasznalonev], (err, rows) => {
            return callback(err, rows);
        });
    },
    getKozlemenyBySzerzoNev: (nev, callback) => {
        connection.query('SELECT * FROM Kozlemeny, Szerzo, szerzoi WHERE Kozlemeny.id = szerzoi.kozl_id AND szerzoi.szerzo_id = Szerzo.id AND Szerzo.nev =?', [nev], (err, rows) => {
            return callback(err, rows);
        });
    },
    updateKozlemeny: (kozlemeny, callback) => {
        connection.query('SET FOREIGN_KEY_CHECKS=0', (err, rows) => {
            connection.query('DELETE FROM szerzoi WHERE kozl_id=?', [kozlemeny.id], (err, rows) => {});
            kozlemeny.szerzoi.forEach(element => {
                connection.query('INSERT INTO szerzoi SET szerzo_id=?, kozl_id=?', [element, kozlemeny.id], (err, rows) => {
                    if (err) throw err;
                }); 
            });
        });
        connection.query('SET FOREIGN_KEY_CHECKS=1', (err, rows) => {
            connection.query('UPDATE Kozlemeny SET cim=?, folyoirat_azon=?, kiadas_eve=?, felhasznalonev=?, publikacioTipusa=?, publikacioFajlPath=? WHERE id=?', [kozlemeny.cim, kozlemeny.folyoirat_azon, kozlemeny.kiadas_eve, kozlemeny.felhasznalonev, kozlemeny.publikacioTipusa, kozlemeny.publikacioFajlPath, kozlemeny.id], (err, rows) => {
                return callback(err, rows);
            });
        });
    },
    deleteKozlemeny: (kozlemeny, callback) => {
        connection.query('DELETE FROM Kozlemeny WHERE id=?', [kozlemeny.id], (err, rows) => {
            return callback(err, rows);
        });
    },
    addKozlemeny: (kozlemeny, callback) => {
        console.log(kozlemeny);
        connection.query('INSERT INTO Kozlemeny SET id=?, cim=?, folyoirat_azon=?, kiadas_eve=?, felhasznalonev=?, publikacioTipusa=?, publikacioFajlPath=?', [kozlemeny.id, kozlemeny.cim, kozlemeny.folyoirat_azon, kozlemeny.kiadas_eve, kozlemeny.felhasznalonev, kozlemeny.publikacioTipusa, kozlemeny.publikacioFajlPath], (err, rows) => {
            return callback(err, rows);
        });
        kozlemeny.szerzoi.forEach(element => {
            connection.query('INSERT INTO szerzoi SET szerzo_id=?, kozl_id=?', [element, kozlemeny.id], (err, rows) => {
                
            }); 
        });

    },
    getKozlemenyWaitingForAcceptance(callback) {
        connection.query('SELECT * FROM Kozlemeny WHERE elfogadva=0', (err, rows) => {
            return callback(err, rows);
        });
    },
    acceptKozlemeny(id, callback) {
        connection.query('UPDATE Kozlemeny SET elfogadva=1 WHERE id=?', [id], (err, rows) => {
            return callback(err, rows);
        });
    },
    declineKozlemeny(id, callback) {
        connection.query('DELETE FROM Kozlemeny WHERE id=?', [id], (err, rows) => {
            return callback(err, rows);
        });
    },
    getKozlemenyekByKiadoNev(kiado_nev, callback) {
        connection.query('SELECT Kozlemeny.cim, Kozlemeny.elfogadva, Kozlemeny.felhasznalonev, Kozlemeny.folyoirat_azon, Kozlemeny.id, Kozlemeny.kiadas_eve FROM Kozlemeny, Folyoirat WHERE Kozlemeny.folyoirat_azon = Folyoirat.id AND Folyoirat.kiado=?', [kiado_nev], (err, rows) => {
            return callback(err, rows);
        });
    },
    getKozlemenyByTipus(felhasznalonev, tipus, callback) {
        connection.query('SELECT * FROM Kozlemeny WHERE felhasznalonev=? AND publikacioTipusa=?', [felhasznalonev, tipus], (err, rows) => {
            return callback(err, rows);
        });
    }
};