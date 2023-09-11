const qrcode = require('qrcode-terminal');

const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

async function createClient(clientId, prompts, store) {
  console.log("018")
  const client = new Client({
    authStrategy: new RemoteAuth({
      clientId:clientId,
      store: store,
      backupSyncIntervalMs: 600000
    })
  })
  // Handle events and authentication here
  client.on('qr', qr => {
    console.log("013")
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('Client ' + clientId + ' is ready!');
  });

  client.on('remote_session_saved', () => {
    console.log("Remote session saved")
  })


  client.on("message", message => {
    console.log(clientId + ' New Message : ' + message.body + " " + message.from);
    prompts.forEach(element => {
      if (message.body == element.prompt)
        message.reply(element.reply);
    });
  })

  await client.initialize();
  console.log("09")

  return client;
}


async function main() {

  let prompts = [{ prompt: "hello goodmorning", reply: "same here morning" }, { prompt: "hello goodafternoon", reply: "same here afternoon" }, { prompt: "hello goodevening", reply: "same here evening" }]
  mongoose.connect("").then(async () => {
    console.log("01")
    let store = new MongoStore({ mongoose: mongoose });
    // console.log("012")
    // let tester = await createClient("client2", prompts, store)
    // let tester2 = await createClient("client1", prompts, store)
  });


  // tester.sendMessage('2348101083890@c.us', 'brodcast message example').then((message) => {
  //   console.log('Message sent successfully:');
  // }).catch((error) => {
  //   console.error('Error sending message:', error);
  // });

}



main()