const config = require('../config/config.env')
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const ContactService = require('../services/contact.services')
const CustomError = require('../utils/custom-errors')
const { Agent, ContactList } = require('../config/db')
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { generateToken } = require('../utils/tools')
const { MongoStore } = require('wwebjs-mongo');
const { MessageMedia } = require('whatsapp-web.js');
const { getUpdatedToken } = require('../utils/googleTools')
const { Op } = require("sequelize");
const mongoose = require('mongoose');
// const { connectMongo } = require('../config/monDb')
let store
let runningInstances = []
let activeInstances = []

class AgentService {

  async create(clientId, options, owner) {
    return new Promise(async (resolve, reject) => {
      const client = new Client({
        puppeteer: {
          executablePath: '/usr/bin/google-chrome-stable',
      },
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
        this.createState(clientId, "RUNNING", options, owner)
      });

      client.on("message", message => {
        console.log(clientId + ' New Message : ' + message.body + " " + message.from);

        if (options.agent.active) {
          options.agent.handler.forEach(handler => {
            if (message.body == handler.prompt) {
              //Handling auto responder
              handler.replys.forEach(reply => {
                setTimeout(async () => {
                  switch (reply.type) {
                    case "T":
                      message.reply(reply.text);
                      break;
                    case "P":
                      const Pmedia = await MessageMedia.fromUrl(reply.link);
                      Pmedia.mimetype = "image/jpg";
                      Pmedia.filename = "CustomImageName.png";
                      message.reply(Pmedia)
                      .then((message) => { 
                        console.log('Image sent successfully:', message);
                      })
                      .catch((error) => {
                        console.error('Error sending image:', error);
                      });
                      break;
                    case "V":
                      const Vmedia = await MessageMedia.fromUrl(reply.link);
                      Vmedia.mimetype = "video/mp4";
                      Vmedia.filename = "CustomImageName.mp4";
                      message.reply(Vmedia)
                      .then((message) => {
                        console.log('Video sent successfully:', message);
                      })
                      .catch((error) => {
                        console.error('Error sending video:', error);
                      });
                      break;
                    case "A":
                      axios.get(reply.link, { responseType: 'arraybuffer' })
                        .then((response) => {
                          // Create a MessageMedia object with the image data
                          const media = new MessageMedia('audio/mp3', response.data);

                          // Send the image as a media message
                          message.reply(media)
                            .then((message) => {
                              console.log('Audio sent successfully:', message);
                            })
                            .catch((error) => {
                              console.error('Error sending audio:', error);
                            });
                        })
                        .catch((error) => {
                          console.error('Error downloading audio:', error);
                        });
                      break;
                    default:
                      break;
                  }
                }, (handler.interval * 1000));

              });
              // Handling auto saving to list
              if (handler.autoSaveToList.active) {

                // get the name and phone number of the person and arraing it as {name, phoneNumber}
                ContactService.saveToListsFromAgent(person, handler.autoSaveToList.lists)
              }

              // Handling auto saving to google contacts
              if (handler.autoSaveToContacts.active) {

                // get the name and phone number of the person and arraing it as {name, phoneNumber}
                // add preffix and suffix
                ContactService.saveToContactsFromAgent(person, handler.autoSaveToList.lists)
              }

            }
          });



        }
      })

      await client.initialize();
      activeInstances.push(client)
      resolve({ client })
    })
  }

  async generateclientId(clientId) {

    const extra = generateToken()

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
      await Agent.update({ state, config: JSON.stringify(config) }, {
        where: {
          id: oldClient.id
        }
      });

      return true

    } else {
      let newClient = await Agent.create({ clientid, state, owner, config: JSON.stringify(config) })
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
      attributes: ['id', 'clientid', 'state', 'config', 'updatedAt', 'createdAt'],
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

  async verifyOptions(options, owner) {
    if (options.agent.active) {
      await Promise.all(options.agent.handler.map(async handler => {
        if (handler.autoSaveToContacts.active) {
          await getUpdatedToken(owner)
        }
        if (handler.autoSaveToLists.active) {
          await Promise.all( handler.autoSaveToLists.lists.map(async listid => {
            const list = await ContactList.findOne({
              attributes: ['id', 'type'],
              where: {
                [Op.and]: [
                  { id: listid },
                  { owner: owner }
                ]
              }
            });
            if (!list) throw new CustomError('list does not exist', 400)
            if (list.type !== "PHONE") throw new CustomError('unsupported list type', 400)
          })
          )
        }
      })
      )

      return true
    } else {
      return true
    }
  }


}

const service = new AgentService()

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
