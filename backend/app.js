const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const user = require('./user.js');
const kozlemeny = require('./kozlemeny.js');
const kiado = require('./kiado.js');
const folyoirat = require('./folyoirat.js');
const szerzo = require('./szerzo.js');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'localhost:3306'
}));

app.get('/user/', async (req, res) => {
    user.getUserByUserName(req.query.felhasznalonev)
        .then((result) => {
            res.send(result);
        });
});
app.post('/user/', (req, res) => {
    user.registerUser(req.query.user, (err, rows) => {
        res.send(rows);
    });
});
app.put('/user/', (req, res) => {
    user.updateUserDetails(req.query.user, (err, rows) => {
        res.send(rows);
    });
});
app.delete('/user/', (req, res) => {
    user.deleteUser(req.query.user, (err, rows) => {
        res.send(rows);
    });
});

app.get('/kozlemeny', (req, res) => {
    kozlemeny.getAllKozlemeny((err, rows) => {
        res.send(rows);
    });
});
app.get('/kozlemeny/', (req, res) => {
    kozlemeny.getKozlemenyById(req.query.id, (err, rows) => {
        res.send(rows);
    });
});
app.get('/kozlemeny/folyoirat/', (req, res) => {
    kozlemeny.getKozlemenyByFolyoirat(req.query.folyoirat_azon, (err, rows) => {
        res.send(rows);
    });
});
app.get('/kozlemeny/szerzo/', (req, res) => {
    kozlemeny.getKozlemenyBySzerzoNev(req.query.nev, (err, rows) => {
        res.send(rows);
    });
});
app.get('/kozlemeny/felhasznalonev/', (req, res) => {
    kozlemeny.getUsersKozlemenyek(req.query.felhasznalonev, (err, rows) => {
        res.send(rows);
    });
});
app.post('/kozlemeny/', (req, res) => {
    kozlemeny.addKozlemeny(req.query.kozlemeny, (err, rows) => {
        res.send(rows);
    });
});
app.put('/kozlemeny/', (req, res) => {
    kozlemeny.updateKozlemeny(req.query.kozlemeny, (err, rows) => {
        res.send(rows);
    });
});
app.delete('/kozlemeny/', (req, res) => {
    kozlemeny.deleteKozlemeny(req.query.kozlemeny, (err, rows) => {
        res.send(rows);
    });
});

app.get('/kiado', (req, res) => {
    kiado.getAllKiado((err, rows) => {
        res.send(rows);
    });
});
app.get('/kiado/', (req, res) => {
    kiado.getKiadoByName(req.query.nev, (err, rows) => {
        res.send(rows);
    });
});
app.post('/kiado/', (req, res) => {
    kiado.addKiado(req.query.kiado, (err, rows) => {    
        res.send(rows);
    });
});
app.put('/kiado/', (req, res) => {
    kiado.updateKiado(req.query.kiado, (err, rows) => {
        res.send(rows);
    });
});
app.delete('/kiado/', (req, res) => {
    kiado.deleteKiado(req.query.kiado, (err, rows) => {
        res.send(rows);
    });
});

app.get('/folyoirat', (req, res) => {
    folyoirat.getAllFolyoirat((err, rows) => {
        res.send(rows);
    });
});
app.get('/folyoirat/', (req, res) => {
    folyoirat.getFolyoiratById(req.query.id, (err, rows) => {
        res.send(rows);
    });
});
app.get('/folyoirat/kiado/', (req, res) => {
    folyoirat.getFolyoiratokByKiado(req.query.kiado_nev, (err, rows) => {
        res.send(rows);
    });
});
app.get('/folyoirat/kozlemeny/', (req, res) => {
    folyoirat.getFolyoiratokByKozlemeny(req.query.kozlemeny, (err, rows) => {
        res.send(rows);
    });
});
app.get('/folyoirat/szerkeszto/', (req, res) => {
    folyoirat.getFolyoiratokBySzerkeszto(req.query.szerkesztoAdmin, (err, rows) => {
        res.send(rows);
    });
});
app.post('/folyoirat/', (req, res) => {
    folyoirat.addFolyoirat(req.query.folyoirat, (err, rows) => {
        res.send(rows);
    });
});
app.put('/folyoirat/', (req, res) => {
    folyoirat.updateFolyoirat(req.query.folyoirat, (err, rows) => {
        res.send(rows);
    });
});
app.delete('/folyoirat/', (req, res) => {
    folyoirat.deleteFolyoirat(req.query.folyoirat, (err, rows) => {
        res.send(rows);
    });
});

app.get('/szerzo', (req, res) => {
    szerzo.getAllSzerzo((err, rows) => {
        res.send(rows);
    });
});
app.get('/szerzo/kozlemeny/', (req, res) => {
    szerzo.getSzerzoByKozlemeny(req.query.kozlemeny, (err, rows) => {
        res.send(rows);
    });
});
app.post('/szerzo/', (req, res) => {
    szerzo.addSzerzo(req.query.szerzo, (err, rows) => {
        res.send(rows);
    });
});
app.put('/szerzo/', (req, res) => {
    szerzo.updateSzerzo(req.query.szerzo, (err, rows) => {
        res.send(rows);
    });
});
app.delete('/szerzo/', (req, res) => {
    szerzo.deleteSzerzo(req.query.szerzo, (err, rows) => {
        res.send(rows);
    });
});

app.listen(port, () => {
    console.log(`this app runs in port: ${port}`);
})