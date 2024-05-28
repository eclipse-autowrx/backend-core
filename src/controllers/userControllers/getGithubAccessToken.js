const axios = require('axios');

const getGithubAccessToken = async (req, res) => {
  try {
    const { code } = req.query;

    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.VITE_GITHUB_CLIENT_ID ?? '',
        client_secret: process.env.GITHUB_CLIENT_SECRET ?? '',
        code,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github+json',
        },
      }
    );

    res.status(200).send(JSON.stringify(response.data));
  } catch (err) {
    res.status(400).send(err.toString());
  }
};

module.exports = {
  getGithubAccessToken,
};
