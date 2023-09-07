const express = require('express')
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser');
dotenv.config()
const { sequelize, syncDatabase } = require('./config/db');


const app = express()

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/user', require('./routes/user.route'));
app.use('/api/agent', require('./routes/agent.route'));
// app.use('/api/public', require('./routes/public.route'));

app.all('*', (req,res) => {
    res.status(404).send('Page not Found')
  })


async function startApp() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await syncDatabase();
  } catch (error) {
    console.log(error)
  }
}

app.listen(5000, ()=>{
      console.log('App is running on port 5000')
      startApp();
  })
  