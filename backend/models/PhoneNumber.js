// models/User.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // To generate UUIDs

module.exports = (sequelize) => {
  const PhoneNumber = sequelize.define('PhoneNumber', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isverified: {
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Set the default value to the current date and time
      allowNull: false,
    },
    // Add more properties as needed
  });
  // models/Post.js
  // ...

  // Before creating a new user, generate a UUID and assign it to the 'id' field
  PhoneNumber.beforeCreate((phonenumber) => {
    phonenumber.id = uuidv4();
  });
  
  return PhoneNumber;
}
