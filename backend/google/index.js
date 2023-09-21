// https://accounts.google.com/o/oauth2/auth?client_id=412439119658-ra0e65nejusr4td1lhn4u3m31j8b23mp.apps.googleusercontent.com&redirect_uri=http://localhost:3000/oAuth&scope=https://www.googleapis.com/auth/contacts&response_type=code&state=STATE_STRING



// https://accounts.google.com/o/oauth2/auth?access_type=offline&prompt=consent&client_id=412439119658-ra0e65nejusr4td1lhn4u3m31j8b23mp.apps.googleusercontent.com&redirect_uri=http://localhost:3000/oAuth&scope=https://www.googleapis.com/auth/contacts&response_type=code&state=STATE_STRING


// http://localhost:3000/oAuth?state=STATE_STRING&code=4/0Adeu5BV6LuGz5NUQhZuDpafhGV9yPNIlHwR2L5EwYuKPydBJcjrDqs7KLCl9SnvUeV-R0Q&scope=https://www.googleapis.com/auth/contacts








// http://localhost:3000/oAuth?state=STATE_STRING&code=4/0Adeu5BVzbu5hGgpwWcaSsmZSwz1oGB4uJatWl4gcQLjv09ugUUchokWikOBxAna2q0q0Tg&scope=https://www.googleapis.com/auth/contacts








// {
//     "access_token": "ya29.a0AfB_byBjpqxbDXVL3fPVYpmmTxR58IvxUhkUaqQLt4QF5inBGfsQGnbFOtj0qeBC6fknMYFAbTFy6JLXbr5aqzWFOHe4BHxInUEHrPCVeIX8ksQ5jEVicBXuFviLhNoHkOnCpdPNHs-ScOLS4uO51RXckvHlJNBGgaJ2aCgYKASgSARASFQGOcNnCfxJhH6CVbr4bJmF18kfiuA0171",
//     "expires_in": 3599,
//     "refresh_token": "1//0360zEa6eIgfcCgYIARAAGAMSNwF-L9IrBUQ6h-nimcIYek9ZGIMfzfK9-OB5Zt6ttTXRSb8pF8uO3Bi2MmTH3VcwmtbxOZiesrk",
//     "scope": "https://www.googleapis.com/auth/contacts",
//     "token_type": "Bearer"
// }






const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = 3000;
const client_id = '412439119658-ra0e65nejusr4td1lhn4u3m31j8b23mp.apps.googleusercontent.com'; // Replace with your OAuth 2.0 client ID
const client_secret = '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'; // Replace with your OAuth 2.0 client secret
const redirect_uri = 'http://localhost:3000/oAuth'; // Replace with your redirect URI

const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uri);

// Set up a route to initiate OAuth 2.0 authentication
app.get('/auth', (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // Use 'offline' to get a refresh token
    scope: ['https://www.googleapis.com/auth/contacts'], // Replace with the desired scope
  });
  res.redirect(authorizeUrl);
});

// Handle the OAuth 2.0 callback
app.get('/oAuth', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);

  // You now have the access and refresh tokens
  console.log('Access Token:', tokens.access_token);
  console.log('Refresh Token:', tokens.refresh_token);

  // Use the access token to make API requests
  // ...

  res.send('Authentication successful.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});




