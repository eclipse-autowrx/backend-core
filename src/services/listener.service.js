const { getIO } = require('../config/socket');

const findSocketByUser = (userId) => {
  const io = getIO();
  let socket = null;
  io.sockets.sockets.forEach((value) => {
    if (String(value.request._query.userId) === String(userId)) {
      socket = value;
    }
  });
  return socket;
};

const emitDataToSocket = (socket, event, data) => {
  if (socket) {
    socket.emit(event, data);
  }
};

module.exports = {
  findSocketByUser,
  emitDataToSocket,
};
