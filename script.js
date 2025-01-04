const serverUrl = "ws://cliente15.ddns.net:12345"; // Atualize com o URL do WebSocket
let socket;

// Conectar ao WebSocket
function connectToServer() {
    socket = new WebSocket(serverUrl);

    socket.onopen = () => {
        addMessage("Conectado ao servidor.", "server-message");
    };

    socket.onmessage = (event) => {
        addMessage(event.data, "server-message");
    };

    socket.onclose = () => {
        addMessage("Conexão encerrada.", "server-message");
    };

    socket.onerror = (error) => {
        addMessage(`Erro: ${error}`, "server-message");
    };
}

// Adicionar mensagem ao log
function addMessage(message, className) {
    const chatLog = document.getElementById("chat-log");
    const messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.textContent = message;
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight; // Rolar para o final
}

// Enviar mensagem
function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();
    if (message && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        addMessage(`Você: ${message}`, "user-message");
        messageInput.value = "";
    }
}

// Eventos
document.getElementById("send-message-btn").addEventListener("click", sendMessage);
document.getElementById("message-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// Inicializar
connectToServer();
