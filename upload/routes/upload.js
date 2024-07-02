/* eslint-disable object-shorthand */
const express = require('express');
const multer = require('multer');
const config = require('../configs/config');
const constant = require('../configs/constant');
const {
  getContainPathDefault,
  getSystemPath,
  getFilenameFromPath,
  getFileUrlFromPath,
  getItemRelativePath,
  isDir,
  formatLeadingSlash,
} = require('../utils/pathUtils');
const router = express.Router();
const fs = require('fs');
const sharp = require('sharp');
const { isImage, getThumbPath } = require('../utils/imageUtils');
const { v4: uuidv4 } = require('uuid');
const { isCompressFile, unzipFile } = require('../utils/compressUtils');
const path = require('path');
const limitImageSize = require('../middlewares/limitFileSize.middleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = req.params.dir;

    // Allow some dirs only
    if (!config.appDataDirs.includes(dir)) {
      return cb(new Error(constant.DIR_IS_NOT_ALLOWED), null);
    }

    // Init containPath as dir
    let containPath = dir;
    if (req.body.path) {
      // Ensure the first letter is always a '/'
      req.body.path = formatLeadingSlash(req.body.path);
      containPath = getContainPathDefault(req.body.path, dir);
    } else if (req.body.containPath) {
      // Ensure the first letter is always a '/'
      req.body.containPath = formatLeadingSlash(req.body.containPath);
      containPath = dir + req.body.containPath;
    }

    if (!isDir(containPath)) {
      return cb(new Error(constant.INVALID_PATH), null);
    }

    fs.mkdirSync(getSystemPath(containPath), { recursive: true });
    cb(null, getSystemPath(containPath));
  },
  filename: function (req, file, cb) {
    // Random a name if request does not have path and containPath
    if (!req.body.path && !req.body.containPath) {
      req.body.path = '/' + uuidv4() + path.extname(file.originalname);
    }

    const force = req.query.force;
    let filename = file.originalname;

    // Check if filename is valid and get filename
    if (req.body.path) {
      // Ensure the first letter is always a '/'
      req.body.path = formatLeadingSlash(req.body.path);
      if (req.body.path.lastIndexOf('/') === -1 || req.body.path[req.body.path.length - 1] === '/') {
        return cb(new Error(constant.INVALID_PATH), null);
      }
      filename = getFilenameFromPath(req.body.path);
    } else {
      // Ensure the first letter is always a '/'
      req.body.containPath = formatLeadingSlash(req.body.containPath);
    }

    // Get full path of item
    const dir = req.params.dir;
    const containPath = req.body.path ? getContainPathDefault(req.body.path, dir) : dir + req.body.containPath;
    const fullPath = getSystemPath(`${containPath}/${filename}`);

    if (force !== 'true') {
      if (fs.existsSync(fullPath)) {
        return cb(new Error(constant.EXISTED_FILE));
      }
    }

    cb(null, filename);
  },
});

const upload = multer({
  storage,
});

// Upload single
router.post('/:dir', async (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
    const uploadResult = handleUploadError(err, res, next);
    if (uploadResult) {
      return;
    }

    limitImageSize(req.file);

    const result = {};

    let deploymentUrl = undefined;

    try {
      let filePath = getItemRelativePath(req.file.path);

      const url = getFileUrlFromPath(filePath);
      result.url = url;

      // Auto unzip if in development mode
      if (isCompressFile(filePath)) {
        try {
          unzipFile(req.file.path);
          const containDir = path.dirname(req.file.path) + '/' + path.parse(req.file.path).name;
          deploymentUrl = getFileUrlFromPath(`${containDir}`);
          result.deploymentUrl = deploymentUrl;
        } catch (error) {
          console.log(error);
          return res.status(400).json({
            msg: 'Cannot unzip file',
          });
        }
      }

      // Create thumbnail if it's an image
      if (isImage(filePath)) {
        try {
          const thumbnailPath = generateThumbnail(filePath);
          result.thumbnail = getFileUrlFromPath(thumbnailPath);
        } catch (err) {
          console.log('Generate thumbnail error:', err);
        }
      }

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });
});

// Upload bulk
router.post('/:dir/bulk', async (req, res, next) => {
  upload.array('files')(req, res, async (err) => {
    const uploadResult = handleUploadError(err, res, next);
    if (uploadResult) {
      return;
    }

    const result = [];

    try {
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({
          msg: constant.INVALID_FILES,
        });
      }

      req.files.forEach((file) => {
        limitImageSize(file);
        let filePath = getItemRelativePath(file.path);
        const url = getFileUrlFromPath(filePath);

        const itemResult = {
          url,
        };

        if (isImage(filePath)) {
          try {
            const thumbnailPath = generateThumbnail(filePath);
            itemResult.thumbnail = getFileUrlFromPath(thumbnailPath);
          } catch (err) {
            console.log('Generate thumbnail error:', err);
          }
        }

        result.push(itemResult);
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  });
});

const handleUploadError = (err, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      msg: 'Error processing the file',
    });
    return true;
  }

  if (err && Object.values(constant).includes(err.message)) {
    res.status(400).json({
      msg: err.message,
    });
    return true;
  }

  if (err) {
    next(err);
    return true;
  }

  return false;
};

const generateThumbnail = (filePath) => {
  let thumbPath = getThumbPath(filePath);

  sharp(getSystemPath(filePath))
    .resize({
      fit: sharp.fit.contain,
      width: config.thumbnailSize,
      height: config.thumbnailSize,
    })
    .toFile(getSystemPath(thumbPath), (error, info) => {
      if (error) {
        throw error;
      }
    });

  return thumbPath;
};

module.exports = router;
