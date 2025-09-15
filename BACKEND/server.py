from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import Dict, List

app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {"organizer": [], "freelancer": []}

    async def connect(self, websocket: WebSocket, role: str):
        await websocket.accept()
        self.active_connections[role].append(websocket)

    def disconnect(self, websocket: WebSocket, role: str):
        self.active_connections[role].remove(websocket)

    async def broadcast(self, message: str, sender: str, role: str):
        for connection in self.active_connections["organizer"] + self.active_connections["freelancer"]:
            await connection.send_json({"sender": sender, "message": message, "role": role})

manager = ConnectionManager()

@app.websocket("/ws/{role}/{username}")
async def websocket_endpoint(websocket: WebSocket, role: str, username: str):
    await manager.connect(websocket, role)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast(data["message"], data["sender"], role)
    except WebSocketDisconnect:
        manager.disconnect(websocket, role)

