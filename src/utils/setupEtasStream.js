const WebSocketClient = require('websocket').client;
const { getIO } = require('../config/socket');
let client = null;

const setupClient = (token) => {
  if (!client) {
    const client = new WebSocketClient();

    client.on('connectFailed', function (error) {
      console.log('Connect etas websocket error: ' + error.toString());
    });
    client.on('connect', function (connection) {
      console.log('Etas WebSocket Client Connected');
      connection.on('error', function (error) {
        console.log('Connection Error: ' + error.toString());
      });
      connection.on('close', function () {
        console.log('echo-protocol Connection Closed');
      });
      connection.on('message', function (message) {
        const io = getIO();
        console.log(message.utf8Data);
        io?.sockets?.emit('etas-stream', message.utf8Data);
      });
    });

    client.connect('wss://a96aee443681c44864878093f03f1586.app.pantaris.io/ws', null, null, {
      authorization: `Bearer ${token}`,
    });
  }
};

module.exports = {
  setupClient,
};
