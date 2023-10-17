function relate(User, PhoneNumber, Token, Agent, ContactList, Person, Broadcast) {
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

  User.hasMany(ContactList, {
    foreignKey: 'owner',
    allowNull: false, // Ensure that 'userId' cannot be null
  });
  ContactList.belongsTo(User, {
    foreignKey: 'owner',
    allowNull: false,
  });

  ContactList.hasMany(Person, {
    foreignKey: 'list',
    allowNull: false, // Ensure that 'userId' cannot be null
  });
  Person.belongsTo(ContactList, {
    foreignKey: 'list',
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

  User.hasMany(Broadcast, {
    foreignKey: 'owner',
    allowNull: false, // Ensure that 'userId' cannot be null
  });
  Broadcast.belongsTo(User, {
    foreignKey: 'owner',
    allowNull: false,
  });

  ContactList.hasMany(Broadcast, {
    foreignKey: 'contactlist',
    allowNull: false, // Ensure that 'userId' cannot be null
  });
  Broadcast.belongsTo(ContactList, {
    foreignKey: 'contactlist',
    allowNull: false,
  });

  Agent.hasMany(Broadcast, {
    foreignKey: 'agent',
    allowNull: false, // Ensure that 'userId' cannot be null
  });
  Broadcast.belongsTo(Agent, {
    foreignKey: 'agent',
    allowNull: false,
  });
}

module.exports = relate