'use strict';

const { readdirSync } = require('fs');
const { join, basename } = require('path');
const config = require('../config/db.js');

const db = (new require('sequelize'))(config.database, config.username, config.password, config.options);
const models = {}

const files = readdirSync(__dirname)
    .filter(file => (file.indexOf('.') !== 0) && (file !== basename(__filename)) && (file.slice(-3) === '.js'))

for (const file of files) {
    const model = db.import(join(__dirname, file))
    models[model.name] = model
}

for (const modelName of Object.keys(models)) {
    const model = models[modelName]
    if (model.associate) model.associate(models)
}

module.exports = models;