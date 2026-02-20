        import { Client } from "@stomp/stompjs";
        import SockJS from "sockjs-client";

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

           //const socket = new SockJS("http://localhost:8085/ws");
          // ✅ Use the actual STOMP endpoint registered in Spring Boot
           const socket = new SockJS(`http://localhost/ws`);  //for nignix
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
