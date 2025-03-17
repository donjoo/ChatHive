import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const useWebSocket = (token, roomId) => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/?token=${token}&room_id=${roomId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    setSocket(ws);
    
    return () => ws.close();
  }, [token, roomId]);

  const sendMessage = (message) => {
    if (socket) {
      socket.send(JSON.stringify({ message }));
    }
  };

  return { messages, sendMessage };
};

export default useWebSocket;
