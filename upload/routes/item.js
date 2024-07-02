const express = require('express');
const forbidRelativePath = require('../middlewares/forbidRelativePath.middleware');

const router = express.Router();
const fs = require('fs');
const { getSystemPath } = require('../utils/pathUtils');
const { isImage, getThumbPath } = require('../utils/imageUtils');
const path = require('path');
const { isCompressFile, getContainDirOfZipFile } = require('../utils/compressUtils');

// Delete item
router.delete('/', forbidRelativePath, async (req, res, next) => {
  try {
    const itemPath = req.query.path;

    // Check if item exists
    const itemSystemPath = getSystemPath(itemPath);
    if (!fs.existsSync(itemSystemPath)) {
      return res.status(404).json({
        msg: 'No such file or directory',
      });
    }
    fs.rmSync(itemSystemPath, { recursive: true });

    // If item is image then also delete its thumbnail
    if (isImage(itemPath)) {
      const thumbPath = getThumbPath(itemPath);
      const thumbSystemPath = getSystemPath(thumbPath);
      fs.rmSync(thumbSystemPath);
    }

    // If item is zip file then also delete its deployment folder
    if (isCompressFile(itemPath)) {
      const containDir = getContainDirOfZipFile(itemPath);
      fs.rmSync(getSystemPath(containDir), { recursive: true });
    }
    res.status(200).json({ msg: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.put('/', forbidRelativePath, async (req, res, next) => {
  const oldPath = req.query.path;
  const { newPath } = req.body;

  if (!newPath) {
    return res.status(400).json({
      msg: 'Missing newPath',
    });
  }

  if (!path.isAbsolute(newPath)) {
    return res.status(400).json({
      msg: 'New path must be absolute',
    });
  }
  const oldSystemPath = getSystemPath(oldPath);
  if (!fs.existsSync(oldSystemPath)) {
    return res.status(400).json({
      msg: 'Item does not exist',
    });
  }
  const newSystemPath = getSystemPath(newPath);

  try {
    fs.renameSync(oldSystemPath, newSystemPath);
    if (isImage(oldPath)) {
      const oldThumbPath = getThumbPath(oldSystemPath);
      const newThumbPath = getThumbPath(newSystemPath);
      fs.renameSync(oldThumbPath, newThumbPath);
    }
    res.status(200).json({
      msg: 'Renamed successfully',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
