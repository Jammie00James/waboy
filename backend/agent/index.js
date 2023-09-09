const qrcode = require('qrcode-terminal');

const { Client, LocalAuth } = require('whatsapp-web.js');

async function createClient(clientId, prompts) {

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: clientId })
  });

  // Handle events and authentication here
  client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
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

  return client;
}


async function main() {

  let prompts = [{ prompt: "hello goodmorning", reply: "same here morning" }, { prompt: "hello goodafternoon", reply: "same here afternoon" }, { prompt: "hello goodevening", reply: "same here evening" }]

  let tester = await createClient("client1", prompts)

  tester.sendMessage('2348101083890@c.us', 'brodcast message example').then((message) => {
    console.log('Message sent successfully:', message);
  }).catch((error) => {
    console.error('Error sending message:', error);
  });

}


main()