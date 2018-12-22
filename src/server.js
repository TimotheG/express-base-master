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
models.Paddocks.hasMany(models.Monkeys, { as: 'Monkeys' });

//! Récupérer Singes et Enclos.
app.get('/monkeys', async (req, res) => {
    const monkeys = await models.Monkeys.findAll()
    const paddocks = await models.Paddocks.findAll()
    res.render('index', { monkeys, paddocks });
})

//! Création d'un singe.
app.get('/createMonkey', async (req, res) => {
    res.render('CreateMonkey')
})

app.post('/monkeys', async (req, res) => {
    await models.Monkeys.create({
        name: req.body.name,
        age: req.body.age,
        breed: req.body.breed
    })
    res.render('MonkeyCreated')
})

//! Modification d'un singe.
app.get('/updatemonkey/:id', (req, res) => {
    res.render('UpdateMonkey', { id: req.params.id })
})

app.post('/monkeys/update/:id', [ MiddleWare ], async (req, res) => {
    console.log(req.body.name)
    await models.Monkeys.update({ name: req.body.name, age: req.body.age, breed: req.body.breed }, { where: { id: req.params.id } })
    res.render('MonkeyUpdated');
})

//! Suppression d'un singe.
app.get('/monkeys/delete/:id', async (req, res) => {
    await models.Monkeys.destroy({ where: { id: req.params.id } })
    res.render("DeleteMonkey")
})

//! Vue detaillée d'un singe.
app.get('/monkeys/:id', async (req, res) => {
    const monkey = await models.Monkeys.findOne({ where: { id: req.params.id } })
    res.render('ViewMonkey', { monkey: monkey });
})

app.get('/monkeyinpaddock/:id', async (req, res) => {
    const paddocks = await models.Paddocks.findAll()
    res.render('MonkeyInPaddock', { id_singe: req.params.id, paddocks });
})

app.get('/addmonkeyinpaddock/:id_singe/:id_enclos', async (req, res) => {
    const monkey = await models.Monkeys.findOne({ where: { id: req.params.id_singe } })
    const paddock = await models.Paddocks.findOne({ where: { id: req.params.id_enclos } })
    paddock.addMonkeys(monkey);
    res.render('AddMonkeyInPaddock');
})

//! Création d'un enclos.
app.get('/createpaddock', async (req, res) => {
    res.render('CreatePaddock')
})

app.post('/paddocks', async (req, res) => {
    await models.Paddocks.create({
        name: req.body.name,
        capacity: req.body.capacity
    })
    res.render('PaddockCreated')
})

//! Modification d'un enclos.
app.get('/updatepaddock/:id', async (req, res) => {
    res.render('UpdatePaddock', { id: req.params.id })
})

app.post('/paddocks/update/:id', [MiddleWare], async (req, res) => {
    await models.Paddocks.update({ name: req.body.name, capacity: req.body.capacity }, { where: { id: req.params.id } })
    res.render('PaddockUpdated');
})

//! Suppression d'un enclos.
app.get('/paddocks/delete/:id', async (req, res) => {
    await models.Paddocks.destroy({ where: { id: req.params.id } })
    res.render("DeletePaddock")
})

//! Vue detaillée d'un enclos.
app.get('/paddocks/:id', async (req, res) => {
    const paddock = await models.Paddocks.findOne({ where: { id: req.params.id } })
    const monkeys = await paddock.getMonkeys()
    res.render('ViewPaddock', { paddock, monkeys })
})

function MiddleWare(req, res, next) {
    for (const key in req.body)
        if (req.body[key] === '')
            delete req.body[key]
    next()
}

// Synchronize models
models.sequelize.sync().then(function() {
  /**
   * Listen on provided port, on all network interfaces.
   * 
   * Listen only when database connection is sucessfull
   */
  app.listen(process.env.PORT, function() {
    console.log('Express server listening on port ' + process.env.PORT);
  });
});