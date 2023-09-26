// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ContactList = sequelize.define('ContactList', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
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
    return ContactList;
}
