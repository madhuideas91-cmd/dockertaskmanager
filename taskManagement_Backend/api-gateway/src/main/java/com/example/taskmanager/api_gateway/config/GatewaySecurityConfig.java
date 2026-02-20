    package com.example.taskmanager.api_gateway.config;


    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.http.HttpMethod;
    import org.springframework.security.config.web.server.ServerHttpSecurity;
    import org.springframework.security.web.server.SecurityWebFilterChain;

    @Configuration
    public class GatewaySecurityConfig {

        @Bean
        public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {

            http
                    .csrf(ServerHttpSecurity.CsrfSpec::disable)
                    .cors(cors -> {}) //  VERY IMPORTANT
                    .authorizeExchange(exchange -> exchange
                            .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll() //  REQUIRED
                            //  ADD THIS LINE
                            .pathMatchers("/actuator/**").permitAll()
                            .pathMatchers("/api/auth/**").permitAll()
                            .pathMatchers("/tasks/**").permitAll()
                            .pathMatchers("/notifications/**").permitAll()
                            .pathMatchers("/api/comments/**").permitAll()
                            .pathMatchers("/projects/**").permitAll()
                            .pathMatchers("/api/teams/**").permitAll()
                            .pathMatchers("/ws/**").permitAll()   //  ADD THIS
                            .anyExchange().authenticated()
                    );

            return http.build();
        }
    }
