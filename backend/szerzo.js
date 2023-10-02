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
        connection.query('SELECT * FROM Szerzo, szerzoik, Kozlemeny WHERE szerzoik.szerzo_id = Szerzo.id AND szerzoik.kozl_id = Kozlemeny.id AND Kozlemeny.id=?', [kozlemeny.id], (err, rows) => {
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