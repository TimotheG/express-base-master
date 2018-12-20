const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express()
const models = require('./models/index');
const Sequelize = require('sequelize');
const pug = require('pug');
const path = require('path');

// Decode json and x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));


// Add a bit of logging
app.use(morgan('short'))

models.Monkeys.belongsTo(models.Paddocks);
models.Paddocks.hasMany(models.Monkeys, { as: "Monkeys" });

//! Récupérer Singes et Enclos.
app.get('/monkeys', function (req, res) {
    var m_Monkeys = [];
    var m_Paddocks = [];

    models.Monkeys.findAll()
        .then((monkeys) => {
           
            m_Monkeys = monkeys;
        })
    models.Paddocks.findAll()
        .then((paddocks) => {
            
            m_Paddocks = paddocks;
        })
        .then(() => {
            res.render('index', { monkeys: m_Monkeys, paddocks: m_Paddocks });
        })
})

//! Création d'un singe.
app.get('/createMonkey', function (req, res) {
    res.render('CreateMonkey')
})

app.post('/monkeys', function (req, res) {
    models.Monkeys.create({
        name: req.body.name,
        num: req.body.num,
        color: req.body.color
    })
        .then(() => {
            res.render('MonkeyCreated')
        })
})

//! Modification d'un singe.
app.get('/updatemonkey/:id', function (req, res) {
    res.render('UpdateMonkey', { id: req.params.id })
})

app.post('/monkeys/update/:id', [MiddleWareMAJ], function (req, res) {
    console.log(req.body.name)
    models.Monkeys.update({ id: req.body }, { where: { id: req.params.id } })
        .then(() => {
            res.render('MonkeyUpdated');
        })
})

//! Suppression d'un singe.
app.get('/monkeys/delete/:id', function (req, res) {
    models.Monkeys.destroy({ where: { id: req.params.id } })
        .then((monkey) => {
            res.render("DeleteMonkey")
        })
})

//! Vue detaillée d'un singe.
app.get('/monkeys/:id', function (req, res) {
    models.Monkeys.findOne({ where: { id: req.params.id } })
        .then((monkey) => {
            res.render('ViewMonkey', { monkey: monkey });
        })
})


app.get('/monkeyinpaddock/:id', function (req, res) {
    var m_Paddocks = [];
    models.Paddocks.findAll()
        .then((paddocks) => {
            m_Paddocks = paddocks;
        })
        .then(() => {
            res.render('MonkeyInPaddock', { id_singe: req.params.id, paddocks: m_Paddocks });
        })
    
})

app.get('/addmonkeyinpaddock/:id_singe/:id_enclos', function (req, res) {
    var m_Paddock;
    var m_Monkey;
    models.Monkeys.findOne({ where: { id: req.params.id_singe } })
        .then((monkey) => {
             m_Monkey = monkey ;
        })
    models.Paddocks.findOne({ where: { id: req.params.id_enclos } })
        .then((paddock) => {
            m_Paddock = paddock;
            paddock.addMonkeys(m_Monkey);
            
        })
        .then(() => {
            res.render('AddMonkeyInPaddock');
        })
})

//! Création d'un enclos.
app.get('/createpaddock', function (req, res) {
    res.render('CreatePaddock')
})

app.post('/paddocks', function (req, res) {
    models.Paddocks.create({
        nom: req.body.nom,
        capacity: req.body.capacity
    })
        .then(() => {
            res.render('PaddockCreated')
        })
})

//! Modification d'un enclos.
app.get('/updatepaddock/:id', function (req, res) {
    res.render('UpdatePaddock', { id: req.params.id })
})

app.post('/paddocks/update/:id', [MiddleWareMAJ], function (req, res) {
    models.Paddocks.update({ name: req.body.nom, capacity: req.body.capacity }, { where: { id: req.params.id } })
        .then(() => {
            res.render('PaddockUpdated');
        })
})

//! Suppression d'un enclos.
app.get('/paddocks/delete/:id', function (req, res) {
    models.Paddocks.destroy({ where: { id: req.params.id } })
        .then((enclos) => {
            res.render("DeletePaddock")
        })
})

//! Vue detaillée d'un enclos.
app.get('/paddocks/:id', function (req, res) {
    models.Paddocks.findOne({ where: { id: req.params.id } })
        .then((_paddock) => {
            _paddock.getMonkeys().then(associatedTasks => {
                res.render('ViewPaddock', { paddock: _paddock, monkeys: associatedTasks })
            })
        })
})

function MiddleWareMAJ(req, res, next) {
    console.log(req.body);
    const objRet = req.body;
    for (let property in req.body) {
        if (req.body[property] == '') {
            delete objRet[property];
        }
    }
    console.log(objRet);
    req.body = objRet;
    next();
}

// Synchronize models
models.sequelize.sync().then(function() {
  /**
   * Listen on provided port, on all network interfaces.
   * 
   * Listen only when database connection is sucessfull
   */
  app.listen(3000, function() {
    console.log('Express server listening on port 3000');
  });
});
