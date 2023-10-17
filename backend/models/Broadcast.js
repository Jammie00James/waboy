// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Broadcast = sequelize.define('Broadcast', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        count: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        scheduledFor: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        finishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Set the default value to the current date and time
            allowNull: false,
        },
        // Add more properties as needed
    });
    return Broadcast;
}
