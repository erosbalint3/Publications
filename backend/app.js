const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const user = require('./user.js');
const kozlemeny = require('./kozlemeny.js');
const kiado = require('./kiado.js');
const folyoirat = require('./folyoirat.js');
const szerzo = require('./szerzo.js');

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '500mb' }));
const port = 3001;

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/user/', async (req, res) => {
    user.getUserByUserName(req.query.felhasznalonev)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});
app.post('/user/', (req, res) => {
    req.query.user = JSON.parse(req.query.user);
    console.log(req.query.user);
    user.registerUser(req.query.user, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.put('/user/', (req, res) => {
    req.query.user = JSON.parse(req.query.user);
    user.updateUserDetails(req.query.user, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.delete('/user/', (req, res) => {
    req.query.user = JSON.parse(req.query.user);
    user.deleteUser(req.query.user, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});

app.get('/kozlemeny', (req, res) => {
    kozlemeny.getAllKozlemeny((err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/kozlemeny/tipus/', (req, res) => {
    req.query.tipus = JSON.parse(req.query.tipus);
    kozlemeny.getKozlemenyByTipus(req.query.tipus.felhasznalonev, req.query.tipus.tipus, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/kozlemeny/', (req, res) => {
    kozlemeny.getKozlemenyById(req.query.id, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/kozlemeny/folyoirat/', (req, res) => {
    kozlemeny.getKozlemenyByFolyoirat(req.query.folyoirat_azon, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/kozlemeny/szerzo/', (req, res) => {
    kozlemeny.getKozlemenyBySzerzoNev(req.query.nev, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/kozlemeny/felhasznalonev/', (req, res) => {
    kozlemeny.getUsersKozlemenyek(req.query.felhasznalonev, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.post('/kozlemeny/', (req, res) => {
    kozlemeny.addKozlemeny(req.body, (err, rows) => {
        if (err) res.send(err);
        res.send(rows); 
    });
});
app.put('/kozlemeny/', (req, res) => {
    kozlemeny.updateKozlemeny(req.body, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.delete('/kozlemeny/', (req, res) => {
    kozlemeny.deleteKozlemeny(req.body, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/folyoirat/kiado/', (req, res) => {
    folyoirat.getFolyoiratokByKiado(req.query.kiado, (err, rows) => {
        if (err) res.send(err);
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
        if (err) res.send(err);
        res.send(rows);
    });
});
app.post('/kiado/', (req, res) => {
    req.query.kiado = JSON.parse(req.query.kiado);
    kiado.addKiado(req.query.kiado, (err, rows) => {  
        if (err) res.send(err);  
        res.send(rows);
    });
});
app.put('/kiado/', (req, res) => {
    req.query.kiado = JSON.parse(req.query.kiado);
    kiado.updateKiado(req.query.kiado, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.delete('/kiado/', (req, res) => {
    req.query.kiado = JSON.parse(req.query.kiado);
    kiado.deleteKiado(req.query.kiado, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});

app.get('/folyoirat', (req, res) => {
    folyoirat.getAllFolyoirat((err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/folyoirat/', (req, res) => {
    folyoirat.getFolyoiratById(req.query.id, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/folyoirat/kiado/', (req, res) => {
    folyoirat.getFolyoiratokByKiado(req.query.kiado_nev, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/folyoirat/kozlemeny/', (req, res) => {
    folyoirat.getFolyoiratokByKozlemeny(req.query.kozlemeny, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/folyoirat/szerkeszto/', (req, res) => {
    folyoirat.getFolyoiratokBySzerkeszto(req.query.szerkesztoAdmin, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.post('/folyoirat/', (req, res) => {
    req.query.folyoirat = JSON.parse(req.query.folyoirat);
    folyoirat.addFolyoirat(req.query.folyoirat, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.put('/folyoirat/', (req, res) => {
    req.query.folyoirat = JSON.parse(req.query.folyoirat);
    folyoirat.updateFolyoirat(req.query.folyoirat, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.delete('/folyoirat/', (req, res) => {
    req.query.folyoirat = JSON.parse(req.query.folyoirat);
    folyoirat.deleteFolyoirat(req.query.folyoirat, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});

app.get('/szerzo', (req, res) => {
    szerzo.getAllSzerzo((err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/szerzo/kozlemeny/', (req, res) => {
    szerzo.getSzerzoByKozlemeny(req.query.kozlemeny, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.post('/szerzo/', (req, res) => {
    req.query.szerzo = JSON.parse(req.query.szerzo);
    szerzo.addSzerzo(req.query.szerzo, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.put('/szerzo/', (req, res) => {
    req.query.szerzo = JSON.parse(req.query.szerzo);
    szerzo.updateSzerzo(req.query.szerzo, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.delete('/szerzo/', (req, res) => {
    req.query.szerzo = JSON.parse(req.query.szerzo);
    szerzo.deleteSzerzo(req.query.szerzo, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/login/', (req, res) => {
    req.query.user = JSON.parse(req.query.user);
    user.getUserByUserName(req.query.user.felhasznalonev)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.send(err);
        });
});
app.get('/acceptance/', (req, res) => {
    kozlemeny.getKozlemenyWaitingForAcceptance((err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.post('/acceptance/', (req, res) => {
    kozlemeny.acceptKozlemeny(req.query.kozlemenyId, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.delete('/acceptance/', (req, res) => {
    kozlemeny.declineKozlemeny(req.query.kozlemenyId, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/kozlemeny/kiado/', (req, res) => {
    kozlemeny.getKozlemenyekByKiadoNev(req.query.kiado, (err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});
app.get('/user/all', (req, res) => {
    user.getAllUser((err, rows) => {
        if (err) res.send(err);
        res.send(rows);
    });
});


app.listen(port, () => {
    console.log(`this app runs in port: ${port}`);
})