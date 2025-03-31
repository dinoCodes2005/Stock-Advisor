// hooks/web-socket.ts
import { useEffect, useState } from "react";

const useWebSocket = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("✅ WebSocket connected! Web Socket Ts");
    };

    socket.onmessage = (event) => {
      console.log("📡 Data received: ", event.data);
      setData(JSON.parse(event.data));
    };

    socket.onclose = () => {
      console.log("❌ WebSocket disconnected!");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [url]);

  return data;
};

export default useWebSocket;
