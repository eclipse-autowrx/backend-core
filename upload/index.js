const express = require('express');
const cors = require('cors');

const { getSystemPath } = require('./utils/pathUtils');
require('dotenv').config();
const uploadRoute = require('./routes/upload');
const itemRoute = require('./routes/item');
const videoRoute = require('./routes/video');

const app = express();
app.use(
  cors({
    origin: [
      /localhost:\d+/,
      /\.digitalauto\.tech$/,
      /\.digitalauto\.asia$/,
      /\.digital\.auto$/,
      'https://digitalauto.netlify.app',
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use('/data', express.static(getSystemPath('')));
app.use('/video', videoRoute);
app.use('/upload', uploadRoute);
app.use('/item', itemRoute);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({
    msg: 'Internal server error',
  });
});

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

console.log('PORT', process.env.UPLOAD_PORT);

app.listen(process.env.UPLOAD_PORT || 3000, () => {
  console.log(new Date(), 'Listening on port', process.env.UPLOAD_PORT || 3000);
});
