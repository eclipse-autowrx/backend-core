const config = require('../configs/config')
const sizeOf = require('image-size')
const fs = require('fs')
const sharp = require('sharp')
const THRESHOLD = 0.95
/**
 * @param {Express.Multer.File} file
 */
const limitImageSize = async (file) => {
  const types = ['image/jpeg', 'image/png', 'image/jpg']

  if (types.includes(file.mimetype)) {
    const fileSize = fs.statSync(file.path).size

    // If fileSize meet maxImageSize constraint then just do nothing
    if (fileSize <= config.maxImageSize) {
      return
    }

    const ratio = config.maxImageSize / fileSize

    // Only when smaller than this threshold then we do resize
    if (ratio >= THRESHOLD) {
      return
    }

    const dimensions = sizeOf(file.path)

    const buffer = await sharp(file.path)
      .resize({
        fit: sharp.fit.outside,
        width: parseInt(dimensions.width * ratio),
        height: parseInt(dimensions.height * Math.sqrt(ratio)),
      })
      .toBuffer()

    fs.writeFileSync(file.path, buffer)
  }
}

module.exports = limitImageSize
