const config = require('../config/config.env')
const qrcode = require('qrcode-terminal');
const { Agent } = require('../config/db')
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { customAlphabet } = require('nanoid')
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
// const { connectMongo } = require('../config/monDb')
let store
let runningInstances = []

class AgentService {
  async create(clientId, prompts) {
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

      client.on('ready', () => {
        console.log('Client ' + clientId + ' is ready!');
      });

      client.on("message", message => {
        console.log(clientId + ' New Message : ' + message.body + " " + message.from);
        prompts.forEach(element => {
          if (message.body == element.prompt)
            message.reply(element.reply);
        });
      })

      await client.initialize();
      resolve({ client })
    })
  }

  async generateclientId(clientId) {

    const nanoidOTP = customAlphabet('012345789', 4)
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
      await User.update({ state, config }, {
        where: {
          id: oldClient.id
        }
      });

      return true

    } else {
      let newClient = await Agent.create({ clientid, state, owner, config })
      if (newClient) {
        runningInstances.push(newClient)
        return true
      } else {
        return false
      }
    }
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
          if (element.state = "RUNNING") {
            console.log(element.config, JSON.parse(element.config))
            service.create(element.clientid, JSON.parse(element.config))
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
