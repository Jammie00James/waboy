// models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
    otp: {
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
      if(token.type === "EMAIL_VERIFICATION"){
        const saltRounds = 8;
        const hashedcode = await bcrypt.hash(token.otp, saltRounds);
        token.otp = hashedcode;
      }
      if(token.type === "GOOGLE_ACCESS"){
        
      }
    }
  });
  return Token;
}
