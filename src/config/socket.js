const { Server } = require('socket.io');
const logger = require('./logger');

let io = null;

const init = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        /localhost:\d+/,
        /\.digitalauto\.tech$/,
        /\.digitalauto\.asia$/,
        /\.digital\.auto$/,
        'https://digitalauto.netlify.app',
      ],
      credentials: true,
    },
  });

  io.on('connection', () => {
    logger.info('a user connected');
  });
};

const getIO = () => io;

module.exports = {
  getIO,
  init,
};
