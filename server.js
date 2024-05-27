const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const messageData = JSON.parse(message);

    if (messageData.type === 'message') {
      const broadcastMessage = JSON.stringify({
        username: messageData.username,
        text: messageData.text
      });

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(broadcastMessage);
        }
      });
    }
  });
});

console.log('Servidor WebSocket está rodando na porta 3000');
