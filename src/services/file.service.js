const axios = require('axios');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const logger = require('../config/logger');
const config = require('../config/config');

/**
 *
 * @param {File} file
 * @returns {Promise<{url: string}>}
 */
const upload = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    return (await axios.post(`http://upload:${config.services.upload.port}/upload/autowrx`, formData)).data;
  } catch (error) {
    logger.error(`Failed to upload file ${error}`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to upload file');
  }
};

/**
 * @param {string} url
 * @param {'File' | 'Buffer' | 'Uint8Array'} [encoding]
 * @returns {Promise<File | Buffer | Uint8Array>}
 */
const getFileFromURL = async (url, encoding = 'File') => {
  try {
    const response = await fetch(url);
    if (encoding === 'File') {
      const blob = await response.blob();
      const file = new File([blob], 'avatar.jpg', { type: blob.type });
      return file;
    }
    if (encoding === 'Buffer') {
      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer);
    }
    if (encoding === 'Uint8Array') {
      const buffer = await response.arrayBuffer();
      return new Uint8Array(buffer);
    }
    throw new Error('Invalid file format');
  } catch (error) {
    logger.info(`Failed to get file from URL ${url}`);
  }
};

/**
 *
 * @param {File} file1
 * @param {File} file2
 */
const compareImages = async (file1, file2) => {};

module.exports = {
  upload,
  getFileFromURL,
};
