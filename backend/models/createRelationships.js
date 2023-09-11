function relate(User, PhoneNumber, Token, Agent) {
  User.hasMany(PhoneNumber, {
    foreignKey: 'owner',
    allowNull: false, // Ensure that 'userId' cannot be null
  });
  PhoneNumber.belongsTo(User, {
    foreignKey: 'owner',
    allowNull: false,
  });

  User.hasMany(Agent, {
    foreignKey: 'owner',
    allowNull: false, // Ensure that 'userId' cannot be null
  });
  Agent.belongsTo(User, {
    foreignKey: 'owner',
    allowNull: false,
  });


  User.hasMany(Token, {
    foreignKey: 'user',
    allowNull: false, // Ensure that 'userId' cannot be null
  });
  Token.belongsTo(User, {
    foreignKey: 'user',
    allowNull: false,
  });
}

module.exports = relate