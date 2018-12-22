module.exports = (sequelize, DataTypes) => {
    const Paddocks = sequelize.define('Paddocks', {
        name: DataTypes.STRING,
        capacity: DataTypes.INTEGER
    });

    return Paddocks;
};
