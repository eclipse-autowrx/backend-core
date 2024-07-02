const path = require('path');

const forbidRelativePath = async (req, res, next) => {
  try {
    const itemPath = req.body.path || req.query.path || req.body.containPath;

    console.log('itemPath:', itemPath);

    if (!itemPath || path.isAbsolute(itemPath)) {
      next();
      return false;
    }
    res.status(400).json({
      msg: 'Path must be absolute',
    });
    return true;
  } catch (error) {
    next(error);
    return false;
  }
};

module.exports = forbidRelativePath;
