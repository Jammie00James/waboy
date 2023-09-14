// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Person = sequelize.define('Person', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Set the default value to the current date and time
            allowNull: false,
        },
        // Add more properties as needed
    });
    return Person;
}
