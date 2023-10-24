const { Sequelize } = require('sequelize');
const config = require('./config.env')
const UserModel = require('../models/User')
const TokenModel = require('../models/Token')
const PhoneModel = require('../models/PhoneNumber')
const AgentModel = require('../models/Agent')
const ReferralModel = require('../models/Referral')
const PersonModel = require('../models/Person')
const ContactListModel = require('../models/ContactList')
const BroadcastModel = require('../models/Broadcast')
const relate = require('../models/createRelationships.js')


const sequelize = new Sequelize(config.DATABASE, config.DATABASE_USER, config.DATABASE_PASSWORD, {
    host: config.DATABASE_HOST,
    dialect: 'mysql',
    // dialectOptions: {
    //     ssl: {
    //       require: true, // Set to true to require SSL
    //       rejectUnauthorized: false // To accept self-signed certificates
    //     }
    //   }
});


const User = UserModel(sequelize);
const Token = TokenModel(sequelize);
const PhoneNumber = PhoneModel(sequelize);
const Referral = ReferralModel(sequelize);
const Agent = AgentModel(sequelize);
const Person = PersonModel(sequelize)
const ContactList = ContactListModel(sequelize)
const Broadcast = BroadcastModel(sequelize)

relate(User, PhoneNumber, Token, Agent, ContactList, Person, Broadcast)


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
    Referral,
    Token,
    Agent,
    ContactList, 
    Person,
    Broadcast,
    syncDatabase,
};
