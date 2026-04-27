const { GoogleAuth } = require('google-auth-library');
const path = require('path');
require('dotenv').config({ override: true });

async function testAuth() {
  try {
    console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT);
    console.log('Credentials Path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    
    const auth = new GoogleAuth({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    console.log('Successfully retrieved access token!');
  } catch (err) {
    console.error('Auth Test Failed:');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

testAuth();
