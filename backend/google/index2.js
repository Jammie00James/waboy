const { google } = require('googleapis');
const axios = require('axios');

// Set up the Google OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'YOUR_REDIRECT_URI'
);

// Set the refresh token obtained previously
const refreshToken = 'YOUR_REFRESH_TOKEN';

// Set the API key for the People API
const apiKey = 'YOUR_API_KEY';

// Set the desired scope (e.g., 'https://www.googleapis.com/auth/contacts.readonly')
const scope = 'https://www.googleapis.com/auth/contacts.readonly';

// Set the API version
const peopleApiVersion = 'v1';

// Authenticate with the OAuth2 client and set the access token
oauth2Client.setCredentials({ refresh_token: refreshToken });

// Create a Google People API client
const people = google.people({ version: peopleApiVersion, auth: oauth2Client });

// Define a function to fetch contacts
async function getContacts() {
  try {
    // Fetch the list of contact groups (labels)
    const { data: labelsResponse } = await people.contactGroups.list();

    // Get the contact group (label) for "Contacts"
    const contactsLabel = labelsResponse.contactGroups.find(
      (label) => label.name === 'Contacts'
    );

    if (!contactsLabel) {
      throw new Error('Contacts label not found');
    }

    // Fetch the contacts in the "Contacts" label
    const { data: contactsResponse } = await people.people.connections.list({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,phoneNumbers',
      sortOrder: 'FIRST_NAME_ASCENDING',
      pageSize: 1000, // You can adjust this as needed
      resourceName: contactsLabel.resourceName,
    });

    // Print or process the contacts as needed
    console.log(contactsResponse.connections);
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
  }
}

// Call the function to retrieve contacts
getContacts();
