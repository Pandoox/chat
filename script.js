document.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('chatUsername');
  if (!username) {
    window.location.href = 'index.html';
  }

  const chatWindow = document.getElementById('chatWindow');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  
  const socket = new WebSocket('ws://localhost:3000');

  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'join', username }));
  });

  socket.addEventListener('message', (event) => {
    const messageData = JSON.parse(event.data);
    addMessage(messageData.username, messageData.text);
  });

  messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const message = messageInput.value;
    if (message.trim()) {
      socket.send(JSON.stringify({ type: 'message', text: message, username }));
      messageInput.value = '';
    }
  });

  function addMessage(username, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const usernameElement = document.createElement('span');
    usernameElement.classList.add('username');
    usernameElement.textContent = username;

    const textElement = document.createElement('span');
    textElement.classList.add('text');
    textElement.textContent = text;

    messageElement.appendChild(usernameElement);
    messageElement.appendChild(textElement);
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
