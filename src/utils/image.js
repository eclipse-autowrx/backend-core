const Jimp = require('jimp');
const logger = require('../config/logger');

/**
 *
 * @param {string} url1
 * @param {string} url2
 * @returns {Promise<number>}
 */
const diff = async (url1, url2) => {
  try {
    const image1 = await Jimp.read(url1);
    const image2 = await Jimp.read(url2);

    const res = Jimp.diff(image1, image2);
    return res.percent;
  } catch (error) {
    logger.info(`Error comparing images: ${JSON.stringify(error.message || error)}`);
    return -1;
  }
};

module.exports = {
  diff,
};
