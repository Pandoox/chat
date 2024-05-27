const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

let messageHistory = [];

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'history', messages: messageHistory }));

  ws.on('message', (message) => {
    const messageData = JSON.parse(message);

    if (messageData.type === 'message') {
      const broadcastMessage = {
        type: 'message',
        username: messageData.username,
        text: messageData.text
      };

      messageHistory.push(broadcastMessage);
      if (messageHistory.length > 100) {
        messageHistory.shift(); // Limita o histórico a 100 mensagens
      }

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(broadcastMessage));
        }
      });
    }
  });
});

console.log('Servidor WebSocket está rodando na porta 3000');
