import { useState, useEffect } from "react";

export default function ChatBox({ userName, role }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket(`ws://localhost:8000/ws/${role}/${userName}`);
    setWs(websocket);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => websocket.close();
  }, [userName, role]);

  const sendMessage = () => {
    if (ws && message.trim() !== "") {
      ws.send(JSON.stringify({ sender: userName, message }));
      setMessage("");
    }
  };

  return (
    <div className="border p-4 rounded-md">
      <div className="h-40 overflow-y-auto border-b mb-2">
        {messages.map((msg, index) => (
          <p key={index} className={`my-1 ${msg.role === "organizer" ? "text-red-600" : "text-blue-600"}`}>
            <strong>{msg.sender} ({msg.role}):</strong> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full"
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 mt-2">
        Send
      </button>
    </div>
  );
}
