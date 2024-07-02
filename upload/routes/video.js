const express = require('express')
const { getSystemPath } = require('../utils/pathUtils')
const router = express.Router()
const fs = require('fs')
const { chunkSize } = require('../configs/config')
const forbidRelativePath = require('../middlewares/forbidRelativePath.middleware')

router.get('/', forbidRelativePath, async (req, res, next) => {
  const range = req.headers.range
  const videoPath = req.query.path

  if (!videoPath) {
    return res.status(400).json({
      msg: 'Missing path of video',
    })
  }

  if (!range) {
    return res.status(400).json({
      msg: 'Requires range header',
    })
  }

  try {
    const systemVideoPath = getSystemPath(videoPath)
    const videoSize = fs.statSync(systemVideoPath).size
    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + chunkSize, videoSize - 1)
    const contentLength = end - start + 1

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(systemVideoPath, { start, end })
    videoStream.pipe(res)
  } catch (error) {
    next(error)
  }
})

module.exports = router
