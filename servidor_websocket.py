import asyncio
import websockets

# Lista de conexões ativas
connected_clients = set()

async def handle_client(websocket):
    """Gerencia a comunicação com um cliente conectado."""
    # Obter o IP do cliente
    client_ip, _ = websocket.remote_address
    print(f"Cliente conectado: {client_ip}")

    # Adicionar o cliente à lista de conexões
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            print(f"Mensagem recebida de {client_ip}: {message}")
            # Enviar a mensagem para todos os clientes conectados, incluindo o IP
            await broadcast(f"{client_ip}: {message}")
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Conexão encerrada com {client_ip}: {e}")
    finally:
        # Remover o cliente da lista ao desconectar
        connected_clients.remove(websocket)

async def broadcast(message):
    """Envia uma mensagem para todos os clientes conectados."""
    if connected_clients:
        await asyncio.gather(*(client.send(message) for client in connected_clients))

# Configurar o servidor WebSocket
async def main():
    server = await websockets.serve(handle_client, "0.0.0.0", 12345)
    print("Servidor WebSocket iniciado em ws://0.0.0.0:12345")
    await server.wait_closed()

# Executar o servidor
asyncio.run(main())
