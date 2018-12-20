module.exports = (sequelize, DataTypes) => {
    var Paddocks = sequelize.define('Paddocks', {
        
        nom: DataTypes.STRING,
        capacity: DataTypes.INTEGER
    });

    return Paddocks;
};
