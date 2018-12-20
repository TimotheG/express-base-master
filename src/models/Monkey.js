module.exports = (sequelize, DataTypes) => {
    var Monkeys = sequelize.define('Monkeys', {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        breed: DataTypes.STRING
    });

    return Monkeys;
};
