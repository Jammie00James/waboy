const config = require('./config.env')
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
let store
async function connectMongo() {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(config.mongoURI)
            await mongoose.connect(config.mongoURI);
            console.log("Mongo connected");
            store = new MongoStore({ mongoose: mongoose });
            resolve(store); // Resolve the promise with the store instance
        } catch (error) {
            console.error('Error syncing the database:', error);
            reject(error); // Reject the promise with an error if there's an issue
        }
    });
}

connectMongo()

module.exports = {
    connectMongo
};