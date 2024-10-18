const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

const setLastCheckTime = () => {
  fs.writeFileSync('clock.txt', moment().format());
};

const getLastCheckTime = () => {
  try {
    const lastCheckTime = fs.readFileSync('clock.txt', 'utf8');
    return moment(lastCheckTime);
  } catch (error) {
    return moment().subtract(1, 'hour');
  }
};

const updateVSS = async () => {
  try {
    const vssReleases = (await axios.get('https://api.github.com/repos/COVESA/vehicle_signal_specification/releases')).data;
    console.log('vssReleases');
    console.log('Hi i just triggered');
    setLastCheckTime();

    let filtered = vssReleases?.map((release) => {
      return {
        name: release.name,
        published_at: release.published_at,
        assetUrl: release.assets?.find((asset) => asset.name.endsWith('.json'))?.url,
      };
    });

    filtered = filtered?.filter((release) => !(release.name && release.name.includes('rc')));

    console.log('filtered');
    console.log(filtered);
  } catch (error) {
    console.error(error);
  }
};

let interval = null;

const setupScheduledCheck = () => {
  const lastCheckTime = getLastCheckTime();
  if (moment().diff(lastCheckTime, 'second') > 1) {
    updateVSS();
  }
  if (!interval) {
    interval = setInterval(updateVSS, 1000 * 60 * 60 * 24);
  }
};

module.exports = setupScheduledCheck;
