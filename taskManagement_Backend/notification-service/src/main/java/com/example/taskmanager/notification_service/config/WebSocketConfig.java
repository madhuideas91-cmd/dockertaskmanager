package com.example.taskmanager.notification_service.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")               //  MUST match frontend: new SockJS("/ws")
                .setAllowedOriginPatterns("*")   // or "http://localhost:3000"
                .withSockJS();                   //  enables /ws/info, /ws/websocket, etc.
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");  // for subscriptions
        registry.setApplicationDestinationPrefixes("/app"); // for sending messages
    }
}
