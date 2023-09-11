const config = require('../config/config.env')
const qrcode = require('qrcode-terminal');
const { Agent } = require('../config/db')
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { customAlphabet } = require('nanoid')
const { store } = require('../config/monDb')
let runningInstances = []
runningInstances = await Agent.findAll();

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

  async createState(clientid, state, owner) {
    let newClient = await Agent.create({ clientid, state, owner })
    if (newClient) {
      runningInstances.push(newClient)
      return true
    } else {
      return false
    }
  }

}
const service = new AgentService()


runningInstances.array.forEach(element => {
  if(element.state = "RUNNING"){
    service.create(element.clientid,element.prompts)
  }
});

module.exports = service