module.exports = (sequelize, DataTypes) => {
    var Paddocks = sequelize.define('Paddocks', {
        
        name: DataTypes.STRING,
        capacity: DataTypes.INTEGER
    });

    return Paddocks;
};
