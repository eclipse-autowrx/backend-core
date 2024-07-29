/* eslint-disable radix */
const sizeOf = require('image-size');
const fs = require('fs');
const sharp = require('sharp');
const config = require('../configs/config');

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB in bytes
const RESIZE_STEP_RATIO = 0.9; // Resize step ratio

/**
 * @param {Express.Multer.File} file
 */
const limitImageSize = async (file) => {
  const types = ['image/jpeg', 'image/png', 'image/jpg'];

  if (types.includes(file.mimetype)) {
    let fileSize = fs.statSync(file.path).size;

    // If fileSize meets maxImageSize constraint then just do nothing
    if (fileSize <= MAX_SIZE_BYTES) {
      return;
    }

    const dimensions = sizeOf(file.path);
    let buffer = fs.readFileSync(file.path);

    while (fileSize > MAX_SIZE_BYTES) {
      dimensions.width = parseInt(dimensions.width * RESIZE_STEP_RATIO);
      dimensions.height = parseInt(dimensions.height * RESIZE_STEP_RATIO);

      // eslint-disable-next-line no-await-in-loop
      buffer = await sharp(buffer)
        .resize({
          fit: sharp.fit.outside,
          width: dimensions.width,
          height: dimensions.height,
        })
        .toBuffer();

      fileSize = buffer.length;
    }

    fs.writeFileSync(file.path, buffer);
  }
};

module.exports = limitImageSize;
