package com.HolosINC.Holos.configuration;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
            config.setAllowedOrigins(List.of("*"));
            config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
            config.setAllowedHeaders(List.of("*"));
            return config;
        }))
        .csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .headers((headers) -> headers.frameOptions((frameOptions) -> frameOptions.disable()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
            .requestMatchers("/api/v1/baseUser/administrator/**").hasAuthority("ADMIN")
            .requestMatchers("/api/v1/artists/administrator/**").hasAuthority("ADMIN")
            .requestMatchers("/api/v1/clients/administrator/**").hasAuthority("ADMIN")
            .requestMatchers("/api/v1/categories/administrator/**").hasAuthority("ADMIN")
            .requestMatchers("/api/v1/reports/admin/**").hasAuthority("ADMIN")
            .requestMatchers("/api/v1/report-types/admin/**").hasAuthority("ADMIN")
            .requestMatchers("/api/v1/status-kanban-order/**").hasAnyAuthority("ARTIST", "ARTIST_PREMIUM") // Acceder a esta api solo si es ARTIST o ARTIST_PREMIUM
            .requestMatchers(HttpMethod.GET, "/api/v1/status-kanban-order/count/**").hasAnyAuthority("ARTIST", "ARTIST_PREMIUM", "CLIENT") // Acceder a esta api solo si es ARTIST o ARTIST_PREMIUM o CLIENT
            .requestMatchers(HttpMethod.PUT,"/api/v1/commisions/{id}/status").hasAnyAuthority("ARTIST", "ARTIST_PREMIUM")
            .requestMatchers(HttpMethod.POST,"/api/v1/commisions/request-payment/{commisionId}").hasAnyAuthority("ARTIST", "ARTIST_PREMIUM")
            .requestMatchers("/api/v1/commisions/**").authenticated()
            .requestMatchers("/api/v1/messages/**").authenticated()
            .requestMatchers("/api/v1/payment/{paymentIntentId}", "/api/v1/payment/all").hasAuthority("ADMIN")
            .requestMatchers("/api/v1/stripe-account/**").hasAnyAuthority("ARTIST", "ARTIST_PREMIUM")
            .requestMatchers("/api/v1/payment/**").authenticated()
            .requestMatchers(HttpMethod.POST,"/api/v1/worksdone/**").hasAnyAuthority("ARTIST", "ARTIST_PREMIUM")
            .requestMatchers("/api/v1/stripe-subsciption/create").hasAuthority("ARTIST")
            .requestMatchers("/api/v1/stripe-subsciption/delete").hasAuthority("ARTIST_PREMIUM")
            .requestMatchers(HttpMethod.PUT, "/api/v1/commisions/**/close").hasAnyAuthority("ARTIST", "ARTIST_PREMIUM")
            .requestMatchers(HttpMethod.PUT, "/api/v1/commisions/{id}/updateImage").hasAnyAuthority("ARTIST", "ARTIST_PREMIUM")
            .anyRequest().permitAll()
        )
        .addFilterBefore(authTokenFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class); // 🔥 Register Filter

    return http.build();
}


    @Bean
	AuthTokenFilter authenticationJwtTokenFilter() {
		return new AuthTokenFilter();
	}

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
