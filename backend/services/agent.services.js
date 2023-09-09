const config = require('../config/config.env')
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

class AgentService {
    async create(clientId, prompts) {
      return new Promise(async (resolve, reject) => {
      const client = new Client({
        authStrategy: new LocalAuth({ clientId: clientId })
      });
    
      // Handle events and authentication here
      client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
        const qrString = qr
        resolve({client,qrString});
      });
    
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
      resolve({client})
    })
  }
}


module.exports = new AgentService()