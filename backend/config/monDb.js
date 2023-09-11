const config = require('./config.env')
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');


await mongoose.connect(config.mongoURI).then(async () => {
    console.log("Mongo connected")

});

let store = new MongoStore({ mongoose: mongoose });


module.exports = {
    store
};