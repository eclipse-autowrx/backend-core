const axios = require('axios');
const express = require('express');

const router = express.Router();

const getAccessToken = async () => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', process.env.ETAS_CLIENT_ID || '');
  params.append('client_secret', process.env.ETAS_CLIENT_SECRET || '');
  params.append('scope', process.env.ETAS_SCOPE || '');

  console.log('ETAS_CLIENT_ID', process.env.ETAS_CLIENT_ID);
  console.log('ETAS_CLIENT_SECRET', process.env.ETAS_CLIENT_SECRET);
  console.log('ETAS_SCOPE', process.env.ETAS_SCOPE);

  try {
    const response = await axios.post(
      'https://p2.authz.bosch.com/auth/realms/EU_CALPONIA/protocol/openid-connect/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      }
    );

    console.log('Authorization response:', response.data.access_token);

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw new Error('Failed to fetch token');
  }
};

const generateAIContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const token = await getAccessToken();
    const instance = process.env.ETAS_INSTANCE_ENDPOINT;

    console.log('ETAS_INSTANCE_ENDPOINT', instance);

    const response = await axios.post(
      `https://${instance}/r2mm/GENERATE_AI`,
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error generating AI content:', error);
    return res.status(500).json({ error: 'Failed to generate AI content' });
  }
};

router.post('/', generateAIContent);

module.exports = router;
