package com.HolosINC.Holos.configuration;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import com.HolosINC.Holos.configuration.jwt.AuthTokenFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthTokenFilter authTokenFilter) throws Exception {
    http
        .cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("http://localhost:8081"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
            config.setAllowedHeaders(List.of("*"));
            return config;
        }))        
        .csrf(AbstractHttpConfigurer::disable)        
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))            
        .headers((headers) -> headers.frameOptions((frameOptions) -> frameOptions.disable()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
            .requestMatchers("/api/v1/auth/**").permitAll()
            .requestMatchers("/api/v1/artists/**").hasAuthority("ARTIST")
            .requestMatchers("/api/v1/worksdone/**").hasAuthority("ARTIST")
            .requestMatchers("/api/v1/works/**").hasAuthority("ARTIST")
            .requestMatchers("/api/v1/status-kanban-order/**").hasAuthority("ARTIST")
            .requestMatchers("/api/v1/milestones/**").authenticated()
            .requestMatchers("/api/v1/users/**").hasAuthority("CLIENT")
            .requestMatchers("/api/v1/commisions/**").authenticated()
            .requestMatchers("/api/v1/worksdone/**").authenticated()
            .requestMatchers("/api/v1/categories/**").authenticated()
            .requestMatchers("/api/v1/search/**").authenticated()
            .anyRequest().authenticated()
        )
        .addFilterBefore(authTokenFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class); // 🔥 Register Filter

    return http.build();
}


    @Bean
	public AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
