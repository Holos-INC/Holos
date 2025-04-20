package com.HolosINC.Holos.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.HolosINC.Holos.auth.payload.request.LoginRequest;
import com.HolosINC.Holos.configuration.jwt.JwtUtils;
import com.HolosINC.Holos.configuration.service.UserDetailsImpl;
import com.HolosINC.Holos.model.BaseUserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

public class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private BaseUserService baseUserService;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private AuthoritiesService authService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testAuthenticateUserSuccess() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password");

        Authentication authentication = mock(Authentication.class);
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "password", List.of(() -> "ROLE_USER"));

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("test-jwt-token");

        mockMvc.perform(post("/api/v1/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.roles[0]").value("ROLE_USER"));

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    public void testAuthenticateUserBadCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/v1/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Credenciales incorrectas!"));

        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    public void testValidateTokenSuccess() throws Exception {
        when(jwtUtils.validateJwtToken("valid-token")).thenReturn(true);

        mockMvc.perform(get("/api/v1/auth/validate")
                .param("token", "valid-token"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(jwtUtils, times(1)).validateJwtToken("valid-token");
    }
    @Test
public void testAuthenticateUserUnexpectedError() throws Exception {
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setUsername("testuser");
    loginRequest.setPassword("password");

    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new RuntimeException("Unexpected error"));

    mockMvc.perform(post("/api/v1/auth/signin")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isInternalServerError())
            .andExpect(content().string("Fallo de autenticacion!"));

    verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
}

@Test
public void testValidateTokenInvalid() throws Exception {
    when(jwtUtils.validateJwtToken("invalid-token")).thenReturn(false);

    mockMvc.perform(get("/api/v1/auth/validate")
            .param("token", "invalid-token"))
            .andExpect(status().isOk())
            .andExpect(content().string("false"));

    verify(jwtUtils, times(1)).validateJwtToken("invalid-token");
}
@Test
public void testAuthenticateUserInvalidRequest() throws Exception {
    LoginRequest loginRequest = new LoginRequest();  // Usuario vacío, lo que debería ser inválido

    mockMvc.perform(post("/api/v1/auth/signin")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isBadRequest())  // Debería responder con un error 400
            .andExpect(jsonPath("$.message").value("Username and password are required"));

    verify(authenticationManager, times(0)).authenticate(any(UsernamePasswordAuthenticationToken.class));  // No debería llamarse al manager si la solicitud es inválida
}
@Test
public void testAuthenticateUserSuccessFullJson() throws Exception {
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setUsername("testuser");
    loginRequest.setPassword("password");

    Authentication authentication = mock(Authentication.class);
    UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testuser", "password", List.of(() -> "ROLE_USER"));

    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(userDetails);
    when(jwtUtils.generateJwtToken(authentication)).thenReturn("test-jwt-token");

    mockMvc.perform(post("/api/v1/auth/signin")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("test-jwt-token"))
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.roles[0]").value("ROLE_USER"))
            .andExpect(jsonPath("$.id").value(1));  // Verificar que el ID del usuario esté en la respuesta

    verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
}


}
