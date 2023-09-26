// const { google } = require('googleapis');
// const axios = require('axios');

// // Set up the Google OAuth2 client
// const oauth2Client = new google.auth.OAuth2(
//   '412439119658-ra0e65nejusr4td1lhn4u3m31j8b23mp.apps.googleusercontent.com',
//   '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',
//   'http://localhost:3000/api/auth/oAuth2ClientCallback'
// );

// // Set the refresh token obtained previously
// const refreshToken = 'YOUR_REFRESH_TOKEN';

// // Set the API key for the People API
// const apiKey = 'AIzaSyCpCU8HnpkiC_S3A-FkTEPxC_ZfYn0DN9U';

// // Set the desired scope (e.g., 'https://www.googleapis.com/auth/contacts.readonly')
// const scope = 'https://www.googleapis.com/auth/contacts';

// // Set the API version
// const peopleApiVersion = 'v1';

// // Authenticate with the OAuth2 client and set the access token
// oauth2Client.setCredentials({ refresh_token: refreshToken });

// // Create a Google People API client
// const people = google.people({ version: peopleApiVersion, auth: oauth2Client });

// // Define a function to fetch contacts
// async function getContacts() {
//   try {
//     // Fetch the list of contact groups (labels)
//     const { data: labelsResponse } = await people.contactGroups.list();

//     // Get the contact group (label) for "Contacts"
//     const contactsLabel = labelsResponse.contactGroups.find(
//       (label) => label.name === 'Contacts'
//     );

//     if (!contactsLabel) {
//       throw new Error('Contacts label not found');
//     }

//     // Fetch the contacts in the "Contacts" label
//     const { data: contactsResponse } = await people.people.connections.list({
//       resourceName: 'people/me',
//       personFields: 'names,emailAddresses,phoneNumbers',
//       sortOrder: 'FIRST_NAME_ASCENDING',
//       pageSize: 1000, // You can adjust this as needed
//       resourceName: contactsLabel.resourceName,
//     });

//     // Print or process the contacts as needed
//     console.log(contactsResponse.connections);
//   } catch (error) {
//     console.error('Error fetching contacts:', error.message);
//   }
// }

// // Call the function to retrieve contacts
// getContacts();














const axios = require('axios');

const refreshToken = '1//03doLOcdODVkTCgYIARAAGAMSNwF-L9IraO2gMFiTskbvM_mRaauqQZBvrAu6IeSvjd5E86pUwXvlY3f05cGrcGIYOZWbXm1a-hg';
const clientId = '412439119658-ra0e65nejusr4td1lhn4u3m31j8b23mp.apps.googleusercontent.com';
const clientSecret = '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';

const tokenUrl = 'https://oauth2.googleapis.com/token';

const data = {
  grant_type: 'refresh_token',
  refresh_token: refreshToken,
  client_id: clientId,
  client_secret: clientSecret,
};

axios
  .post(tokenUrl, new URLSearchParams(data), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  .then((response) => {
    const newAccessToken = response.data.access_token;
    console.log(response+ "\n")
    console.log('New Access Token:', newAccessToken);
  })
  .catch((error) => {
    console.error('Error refreshing access token:', error);
  });
