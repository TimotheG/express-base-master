const Sequelize = require('sequelize')
const config = require('../config/db.js')

class Storage {
    constructor() {
        this.db = new Sequelize(
            config.database,
            config.username,
            config.password,
            config.options
        )

        this.monkey = require('./monkey')(this.db, Sequelize)
        this.paddock = require('./paddocks')(this.db, Sequelize)

        this.monkey.belongsTo(this.paddock)
    }
}

module.exports = new Storage()