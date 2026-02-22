// src/socket/teamSocket.ts
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../config/api";

export const connectTeamSocket = (
  teamId: number,
  onUpdate: () => void
): Client => {
  const token = localStorage.getItem("token");

  // Create SockJS connection
  // Use gateway URL (build-time) or relative path so browser connects via gateway
  const socketBase = API_URL;
  const socket = new SockJS(`${socketBase}/ws`);

  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  client.onConnect = () => {
    // Subscribe to the team topic
    const subscription = client.subscribe(`/topic/team/${teamId}`, (message: IMessage) => {
      try {
        onUpdate();
      } catch (err) {
        console.error("Error in WebSocket update callback:", err);
      }
    });

    // Optional: cleanup function on client.deactivate()
    client.onDisconnect = () => {
      subscription.unsubscribe();
    };
  };

  client.activate();
  return client;
};
