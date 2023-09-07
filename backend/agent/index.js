const qrcode = require('qrcode-terminal');

const fs = require('fs');
const { Client, LegacySessionAuth } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}


const client = new Client({
    authStrategy: new LegacySessionAuth({
        session: sessionData
    })
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
});

client.on('auth_failure', (message) => {
    console.error('Authentication failure:', message);
    // You can take appropriate action here, such as exiting the application.
});


client.initialize();
