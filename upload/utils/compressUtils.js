const AdmZip = require('adm-zip');
const path = require('path');

const isCompressFile = (filePath) => {
  if (path.extname(filePath).toLowerCase() === '.zip') {
    return true;
  }

  return false;
};

const getContainDirOfZipFile = (filePath) => {
  const sliceIndex = path.normalize(filePath).length - path.extname(filePath).length;
  const containDir = /* path.dirname(filePath) */ filePath.slice(0, sliceIndex);
  return containDir;
};

const unzipFile = (filePath) => {
  const containDir = filePath.replace(/\.[^/.]+$/, '');
  const zipFile = new AdmZip(filePath);
  zipFile.extractAllTo(containDir);
};

module.exports = {
  isCompressFile,
  getContainDirOfZipFile,
  unzipFile,
};
