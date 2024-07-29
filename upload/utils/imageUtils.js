const path = require('path');
const config = require('../configs/config');

const isImage = (imgPath) => {
  return config.imgExts.includes(path.extname(imgPath).toLowerCase());
};

const getThumbPath = (imgPath) => {
  const fileExt = path.extname(imgPath);
  const regex = new RegExp(`${fileExt}$`);
  const thumbPath = `${imgPath.replace(regex, '')}_thumbnail${fileExt}`;
  return thumbPath;
};

module.exports = {
  isImage,
  getThumbPath,
};
