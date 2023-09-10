const config = require('./config.env')
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');


await mongoose.connect("").then(async () => {
    console.log("01")

});

let store = new MongoStore({ mongoose: mongoose });


module.exports = {
    store
};