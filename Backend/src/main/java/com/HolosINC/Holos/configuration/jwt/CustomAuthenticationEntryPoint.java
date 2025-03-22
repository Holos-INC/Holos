package com.HolosINC.Holos.configuration.jwt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.HolosINC.Holos.exceptions.UserBannedException;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        Throwable rootCause = getRootCause(authException);

        response.setContentType("application/json");

        if (rootCause instanceof UserBannedException) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"timestamp\": \"" + LocalDateTime.now() + "\","
                    + "\"status\": 403,"
                    + "\"error\": \"Forbidden\","
                    + "\"message\": \"" + rootCause.getMessage() + "\","
                    + "\"path\": \"" + request.getServletPath() + "\"}");
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"timestamp\": \"" + LocalDateTime.now() + "\","
                    + "\"status\": 401,"
                    + "\"error\": \"Unauthorized\","
                    + "\"message\": \"Authentication failed!\","
                    + "\"path\": \"" + request.getServletPath() + "\"}");
        }
    }

    private Throwable getRootCause(Throwable throwable) {
        Throwable cause = throwable.getCause();
        return (cause == null || cause == throwable) ? throwable : getRootCause(cause);
    }
}
