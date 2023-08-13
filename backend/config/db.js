const { Sequelize } = require('sequelize');
const config = require('./config.env')
const UserModel = require('../models/User')
const PhoneModel = require('../models/PhoneNumber')
const relate = require('../models/createRelationships.js')


const sequelize = new Sequelize(config.DATABASE, config.DATABASE_USER, config.DATABASE_PASSWORD, {
    host: config.DATABASE_HOST,
    dialect: 'mysql',
});


const User = UserModel(sequelize);
const PhoneNumber = PhoneModel(sequelize);

relate(User, PhoneNumber)


async function syncDatabase() {
    try {
        await sequelize.sync({ force: true }); // Use { force: true } to drop and recreate the tables on each sync (for development)
        console.log('Database sync complete.');
    } catch (error) {
        console.error('Error syncing the database:', error);
    }
}


module.exports = {
    sequelize,
    User,
    PhoneNumber,
    syncDatabase,
};