const config = require('../config/config.env')
const qrcode = require('qrcode-terminal');
const CustomError = require('../utils/custom-errors')
const { Agent, User } = require('../config/db')
const { Client, RemoteAuth } = require('whatsapp-web.js');
const {generateToken} = require('../utils/tools')
const { MongoStore } = require('wwebjs-mongo');
const { Op } = require("sequelize");
const mongoose = require('mongoose');
// const { connectMongo } = require('../config/monDb')
let store
let runningInstances = []
let activeInstances = []

class AgentService {
  async create(clientId, prompts, owner) {
    return new Promise(async (resolve, reject) => {
      const client = new Client({
        authStrategy: new RemoteAuth({
          clientId: clientId,
          store: store,
          backupSyncIntervalMs: 600000
        })
      })

      // Handle events and authentication here
      client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
        const qrString = qr
        resolve({ client, qrString });
      });


      client.on('remote_session_saved', () => {
        console.log(clientId + "Remote session saved")
      })
      
      client.on('disconnected', () => {
        console.log(clientId + ' disconnected')
      })

      client.on('ready', () => {
        console.log(clientId + ' is ready!');
        this.createState(clientId, "RUNNING", prompts, owner)
      });

      client.on("message", message => {
        console.log(clientId + ' New Message : ' + message.body + " " + message.from);
        prompts.forEach(element => {
          if (message.body == element.prompt)
            setTimeout(() => {
              message.reply(element.reply);
            }, 15000);
        });
      })

      await client.initialize();
      activeInstances.push(client)
      resolve({ client })
    })
  }

  async generateclientId(clientId) {

    const nanoidOTP = generateToken()
    const extra = nanoidOTP()

    return clientId + '-' + extra

  }

  async createState(clientid, state, config, owner) {

    const oldClient = await Agent.findOne({
      attributes: ['id', 'clientid', 'owner'],
      where: {
        clientid: clientid,
      }
    });
    if (oldClient) {
      await Agent.update({ state, config:JSON.stringify(config) }, {
        where: {
          id: oldClient.id
        }
      });

      return true

    } else {
      let newClient = await Agent.create({ clientid, state, owner, config:JSON.stringify(config) })
      if (newClient) {
        runningInstances.push(newClient)
        return true
      } else {
        return false
      }
    }
  }

  async deleteState(clientid, owner) {

    const oldClient = await Agent.findOne({
      attributes: ['id', 'clientid', 'owner'],
      where: {
        [Op.and]: [
          { clientid: clientid },
          { owner: owner }
        ]
      }
    });
    if (oldClient) {
      await Agent.destroy({
        where: {
          id: oldClient.id
        }
      });
      return true
    } else {
      throw new CustomError('Agent does not exist', 400)
    }
  }

  async delete(clientId, owner) {
    if (!clientId) throw new CustomError('Client required to delete', 400)
    let auth = await this.deleteState(clientId, owner)
    if (auth) {
      const targetClientIndex = activeInstances.findIndex((client) => client.authStrategy.clientId === clientId);
      console.log(targetClientIndex)
  
      if (targetClientIndex !== -1) {
        // Send the message using the target client
        await activeInstances[targetClientIndex].logout()
        await activeInstances.splice(targetClientIndex, 1)[0];
        return true
      } else {
        console.log(`Client with ID ${clientId} not found.`);
        return true
      }
  
    } else {
      throw new CustomError('Agent does not exist', 400)
    }
  }

  async all(owner) {
    const agents = await Agent.findAll({
      attributes: ['id', 'clientid', 'state', 'config', 'updatedAt'],
      where: {
        owner: owner
      }
    });
    agents.forEach(element => {
      element.config = JSON.parse(element.config)
    });
    return agents;

  }

  async update(clientId, prompts, owner) {
    const client = await Agent.findOne({
      attributes: ['id', 'clientid', 'state', 'owner'],
      where: {
        [Op.and]: [
          { clientid: clientId },
          { owner: owner }
        ]
      }
    });

    if (!client) throw new CustomError('Agent does not exist', 400)
    if (client.state === "RUNNING") throw new CustomError('Cannot modify running agent, please stop agent and try again', 400)
    const saved = await this.createState(clientId, "STOPPED", prompts, owner)
    if (saved) {
      return true
    } else {
      return false
    }
  }

  async stop(clientId, owner) {
    const client = await Agent.findOne({
      attributes: ['id', 'clientid', 'state', 'config', 'owner'],
      where: {
        [Op.and]: [
          { clientid: clientId },
          { owner: owner }
        ]
      }
    });
    if (!client) throw new CustomError('Agent does not exist', 400)
    if (client.state === "STOPPED") throw new CustomError('Agent is not running', 400)


    const targetClientIndex = activeInstances.findIndex((client) => client.authStrategy.clientId === clientId);
    console.log(targetClientIndex)

    if (targetClientIndex !== -1) {
      // Send the message using the target client
      await activeInstances[targetClientIndex].destroy()
      await activeInstances.splice(targetClientIndex, 1)[0];
      const stopped = await this.createState(clientId, "STOPPED", JSON.parse(client.config), owner)
      if (stopped) {
        return true
      } else {
        return false
      }
    } else {
      console.log(`Client with ID ${clientId} not found.`);
      throw new CustomError('Client with ID ${clientId} not found.', 400)
    }



  }

  async start(clientId, owner) {
    const oldClient = await Agent.findOne({
      attributes: ['id', 'clientid', 'state', 'config', 'owner'],
      where: {
        [Op.and]: [
          { clientid: clientId },
          { owner: owner }
        ]
      }
    });
    if (!oldClient) throw new CustomError('Agent does not exist', 400)
    if (oldClient.state === "RUNNING") throw new CustomError('Agent is already running', 400)

    const { client, qrString } = await this.create(clientId, JSON.parse(oldClient.config), owner)
    return { client, qrString }
  }

}

const service = new AgentService()



console.log(24)

async function connectMongo() {
  console.log(50)
  await mongoose.connect("mongodb+srv://jammy:Happyentry5@cluster0.tetarar.mongodb.net/?retryWrites=true&w=majority")
  console.log("01")
  store = new MongoStore({ mongoose: mongoose });
  // console.log("012")  // let tester2 = await createClient("client1", prompts, store)
}

async function fetchAndProcessInstances() {
  console.log(87)
  runningInstances = await Agent.findAll({
    attributes: ['id', 'clientid', 'state', 'config', 'owner']
  });
}


(async () => {
  try {
    await connectMongo()
    fetchAndProcessInstances()
      .then(() => {
        // console.log(runningInstances)
        runningInstances.forEach(element => {
          if (element.state === "RUNNING") {
            console.log(JSON.parse(element.config))
            service.create(element.clientid, JSON.parse(element.config), element.owner)
          }
        });
      })
      .catch((error) => {
        console.log("An error occoured" + error)
      });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
})();

module.exports = service
