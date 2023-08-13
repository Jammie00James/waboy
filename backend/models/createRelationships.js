function relate(User,PhoneNumber) {
    User.hasMany(PhoneNumber, {
        foreignKey: 'owner',
        allowNull: false, // Ensure that 'userId' cannot be null
      });
    PhoneNumber.belongsTo(User, { 
        foreignKey: 'owner' ,
        allowNull: false,
      });
}

module.exports = relate