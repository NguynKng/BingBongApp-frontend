import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Config from "../envVars"; // import BACKEND_URL từ config

export const useSocket = () => {
  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(Config.BACKEND_URL, {
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("disconnect", (reason) => {
        console.log("⚠️ Socket disconnected:", reason);
      });

      socketRef.current = socket;
      setSocketInstance(socket);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
      }
    };
  }, []);

  return socketInstance;
};
