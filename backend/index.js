const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config()
// const { connectMongo } = require('./config/monDb')
const cookieParser = require('cookie-parser');
const { sequelize, syncDatabase } = require('./config/db');

async function startApp() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await syncDatabase();
  } catch (error) {
    console.log(error)
  }
}

async function commence() {
  try {
    await startApp();
    // await connectMongo();

    const app = express()

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      // Add other CORS headers as needed
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    });

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use('/api/auth', require('./routes/auth.route'));
    app.use('/api/user', require('./routes/user.route'));
    app.use('/api/agent', require('./routes/agent.route'));
    app.use('/api/contact', require('./routes/contact.route'));
    // app.use('/api/public', require('./routes/public.route'));

    app.all('*', (req, res) => {
      res.status(404).send('Page not Found')
    })

    app.listen(5000, () => {
      console.log('App is running on port 3000')
    })
  } catch (error) {
    console.log(error)
  }
}

commence()