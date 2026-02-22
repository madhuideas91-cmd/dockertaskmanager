import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_URL } from "../config/api";

/**
 * Connects to a project-specific WebSocket for live task updates.
 * @param projectId - The project to subscribe to
 * @param onMessage - Callback when a task update occurs
 */
export const connectTaskSocket = (
  projectId: number,
  onMessage: () => void
) => {
  const token = localStorage.getItem("token");

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
    // Subscribe to project-specific tasks topic
    client.subscribe(`/topic/tasks/project/${projectId}`, () => {
      onMessage();
    });
  };

  client.activate();

  return client;
};
