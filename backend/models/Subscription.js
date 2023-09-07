// models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
    bundle: {
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
  Token.beforeSave(async (token) => {
    if (token.changed('otp')) {
      const saltRounds = 8;
      const hashedcode = await bcrypt.hash(token.otp, saltRounds);
      token.otp = hashedcode;
    }
  });
  return Token;
}
