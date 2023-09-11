// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Agent = sequelize.define('Agent', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
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
  return clientId;
}
