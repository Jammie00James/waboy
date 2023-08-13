// models/User.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // To generate UUIDs
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
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
  User.beforeCreate((user) => {
    user.id = uuidv4();
  });
  
  // Before saving a user, hash the password using bcrypt
  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      user.password = hashedPassword;
    }
  });
  
  return User;
}
