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
// const { Json } = require('sequelize/types/utils');
// const { connectMongo } = require('../config/monDb')
//                 liboff12 roger12
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

      client.on('disconnected', qr => {
        console.log("disconnected event fired")
      });

      client.on('destroyed', qr => {
        console.log("destruction event fired")
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
          options.agent.handler.forEach(async handler => {
            if (message.body == handler.prompt) {
              // Handling auto saving to list
              if (handler.autoSaveToLists.active) {
                // get the name and phone number of the person and arraing it as {name, phoneNumber}
                const lPerson = { name: (await message.getContact()).pushname, phoneNumber: '+' + (await message.getContact()).number }
                console.log(message.body)
                console.log(lPerson)
                ContactService.saveToListsFromAgent(lPerson, handler.autoSaveToLists.lists)
              }

              //Handling auto responder
              handler.replys.forEach(reply => {
                setTimeout(async () => {
                  switch (reply.type) {
                    case "T":
                      message.reply(reply.text);
                      break;
                    case "P":
                      const Pmedia = await MessageMedia.fromUrl(reply.link);
                      // Pmedia.mimetype = "image/jpg";
                      // Pmedia.filename = "CustomImageName.png";
                      message.reply(Pmedia)
                        .then((message) => {
                          console.log('Image sent successfully:');
                        })
                        .catch((error) => {
                          console.error('Error sending image:');
                        });
                      break;
                    case "V":
                      const Vmedia = await MessageMedia.fromUrl(reply.link);
                      // Vmedia.mimetype = "video/mp4";
                      // Vmedia.filename = "CustomImageName.mp4";
                      message.reply(Vmedia)
                        .then((message) => {
                          console.log('Video sent successfully:');
                        })
                        .catch((error) => {
                          console.error('Error sending video:');
                        });
                      break;
                    case "A":
                      const Amedia = await MessageMedia.fromUrl(reply.link);
                      // Amedia.mimetype = "audio/mp3";
                      // Amedia.filename = "CustomImageName.mp3";
                      message.reply(Amedia)
                        .then((message) => {
                          console.log('Image sent successfully:');
                        })
                        .catch((error) => {
                          console.error('Error sending image:');
                        });
                      break;
                    default:
                      break;
                  }
                }, (handler.interval * 1000));

              });

              // Handling auto saving to google contacts
              if (handler.autoSaveToContacts.active) {

                // get the name and phone number of the person and arraing it as {name, phoneNumber}
                if (!(await message.getContact()).isMyContact) {
                  let gName = (await message.getContact()).pushname
                  if (handler.autoSaveToContacts.prefix) gName = handler.autoSaveToContacts.prefix + " " + gName
                  if (handler.autoSaveToContacts.suffix) gName = gName + " " + handler.autoSaveToContacts.suffix
                  let cPerson = { name: gName, phoneNumber: '+' + (await message.getContact()).number }

                  ContactService.saveToContactsFromAgent(cPerson, owner)
                }

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
      attributes: ['id', 'clientid', 'state' , 'updatedAt',],
      where: {
        owner: owner
      }
    });
    return agents;
  }



  async details(id, owner) {
    const agent = await Agent.findOne({
      attributes: ['id', 'clientid', 'state', 'config', 'updatedAt', 'createdAt'],
      where: {
        [Op.and]: [
          { id: id },
          { owner: owner }
        ]
      }
    });
    if(!agent) throw new CustomError("List not found",404)
    agent.config = JSON.parse(agent.config)
    return agent;

  }

  async update(id, prompts, owner) {
    const client = await Agent.findOne({
      attributes: ['id', 'clientid', 'state', 'owner'],
      where: {
        [Op.and]: [
          { id: id },
          { owner: owner }
        ]
      }
    });

    if (!client) throw new CustomError('Agent does not exist', 400)
    if (client.state === "RUNNING") throw new CustomError('Cannot modify running agent, please stop agent and try again', 400)
    const saved = await this.createState(client.clientid, "STOPPED", prompts, owner)
    if (saved) {
      return true
    } else {
      return false
    }
  }

  async stop(id, owner) {
    if (!id) throw new CustomError('No agent specified', 400)

    const Sclient = await Agent.findOne({
      attributes: ['id', 'clientid', 'state', 'config', 'owner'],
      where: {
        [Op.and]: [
          { id: id },
          { owner: owner }
        ]
      }
    });
    if (!Sclient) throw new CustomError('Agent does not exist', 400)
    if (Sclient.state === "STOPPED") throw new CustomError('Agent is not running', 400)


    const targetClientIndex = activeInstances.findIndex((client) => client.authStrategy.clientId === Sclient.clientid);
    // console.log(targetClientIndex)

    if (targetClientIndex !== -1) {
      // Send the message using the target client
      await activeInstances[targetClientIndex].destroy()
      await activeInstances.splice(targetClientIndex, 1)[0];
      const stopped = await this.createState(Sclient.clientid, "STOPPED", JSON.parse(Sclient.config), owner)
      if (stopped) {
        return true
      } else {
        return false
      }
    } else {
      console.log(`Client with ID ${Sclient.clientid} not found.`)
      throw new CustomError(`Client with ID ${Sclient.clientid} not found.`, 400)
    }



  }

  async start(id, owner) {
    const oldClient = await Agent.findOne({
      attributes: ['id', 'clientid', 'state', 'config', 'owner'],
      where: {
        [Op.and]: [
          { id: id },
          { owner: owner }
        ]
      }
    });
    if (!oldClient) throw new CustomError('Agent does not exist', 400)
    if (oldClient.state === "RUNNING") throw new CustomError('Agent is already running', 400)

    const { client, qrString } = await this.create(oldClient.clientid, JSON.parse(oldClient.config), owner)
    return { client, qrString }
  }

  async verifyOptions(options, owner) {
    if (options.agent.active) {
      await Promise.all(options.agent.handler.map(async handler => {
        if (handler.autoSaveToContacts.active) {
          await getUpdatedToken(owner)
        }
        if (handler.autoSaveToLists.active) {
          await Promise.all(handler.autoSaveToLists.lists.map(async listid => {
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
