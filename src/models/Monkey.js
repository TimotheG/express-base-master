module.exports = (sequelize, DataTypes) => {
    const Monkeys = sequelize.define('Monkeys', {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        breed: DataTypes.STRING
    });

    return Monkeys;
};
