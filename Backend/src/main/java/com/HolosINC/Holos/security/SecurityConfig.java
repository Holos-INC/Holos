package com.HolosINC.Holos.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/search/**").permitAll() // 🔹 Permite acceso a la búsqueda sin login
                .anyRequest().authenticated() // 🔒 El resto de la API sigue protegida
            )
            .csrf(csrf -> csrf.disable()); // Opcional: Desactivar CSRF si no usas formularios

        return http.build();
    }
}
