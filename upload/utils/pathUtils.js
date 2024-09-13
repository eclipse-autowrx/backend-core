require('dotenv').config();
const path = require('path');
const config = require('../configs/config');

// return full path in the system
const getSystemPath = (itemPath) => {
  if (itemPath && itemPath.length > 0) {
    if (itemPath[0] === '/') {
      // eslint-disable-next-line no-param-reassign
      itemPath = itemPath.slice(1);
    }
  }

  return (config.rootDataDir ?? './') + itemPath;
};

const getFilenameFromPath = (filePath) => {
  return path.basename(filePath);
};

const getContainPathDefault = (filePath, dir) => {
  // Default is '/' if filePath is empty
  return dir + path.dirname(filePath || '/');
};

const normalizeUnix = (filePath) => {
  const formattedPath = path.normalize(filePath);
  return formattedPath.replace(/\\/g, '/');
};

const getFileUrlFromPath = (filePath) => {
  const formattedFilePath = normalizeUnix(path.normalize(filePath).replace(path.normalize(config.rootDataDir), ''));
  const url = `${process.env.UPLOAD_DOMAIN ?? ''}data/${formattedFilePath}`;
  return url;
};

const getItemRelativePath = (itemPath) => {
  const filePath = normalizeUnix(path.normalize(itemPath).replace(path.normalize(config.rootDataDir), ''));
  return filePath;
};

const isDir = (itemPath) => {
  if (path.extname(itemPath) === '') {
    return true;
  }
  return false;
};

const formatLeadingSlash = (itemPath) => {
  let newPath = itemPath;
  if (typeof newPath !== 'string' || newPath.length === 0) {
    // eslint-disable-next-line no-console
    console.log("Format Leading Slash error: path is not a string or it's an empty one");
    return itemPath;
  }
  if (newPath[0] !== '/') {
    newPath = `/${newPath}`;
  }
  return newPath;
};

module.exports = {
  getSystemPath,
  getFilenameFromPath,
  getContainPathDefault,
  normalizeUnix,
  getFileUrlFromPath,
  getItemRelativePath,
  isDir,
  formatLeadingSlash,
};
