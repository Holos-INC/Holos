package com.HolosINC.Holos.model;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

public class BaseUserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private BaseUserService baseUserService;

    @InjectMocks
    private BaseUserController baseUserController;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(baseUserController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testGetAllUsersSuccess() throws Exception {
        BaseUser user1 = new BaseUser();
        user1.setId(1L);
        user1.setUsername("user1");

        BaseUser user2 = new BaseUser();
        user2.setId(2L);
        user2.setUsername("user2");

        List<BaseUser> users = Arrays.asList(user1, user2);

        when(baseUserService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/v1/baseUser/administrator/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].username").value("user1"))
                .andExpect(jsonPath("$[1].username").value("user2"));

        verify(baseUserService, times(1)).getAllUsers();
    }

    @Test
    public void testGetUserByIdSuccess() throws Exception {
        BaseUser user = new BaseUser();
        user.setId(1L);
        user.setUsername("user1");

        when(baseUserService.getUserById(1L)).thenReturn(user);

        mockMvc.perform(get("/api/v1/baseUser/administrator/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user1"));

        verify(baseUserService, times(1)).getUserById(1L);
    }

    @Test
    public void testGetUserByIdNotFound() throws Exception {
        when(baseUserService.getUserById(1L)).thenReturn(null);

        mockMvc.perform(get("/api/v1/baseUser/administrator/users/1"))
                .andExpect(status().isOk())
                .andExpect(content().string(""));

        verify(baseUserService, times(1)).getUserById(1L);
    }

    @Test
    public void testUpdateUserSuccess() throws Exception {
        BaseUser updatedUser = new BaseUser();
        updatedUser.setId(1L);
        updatedUser.setUsername("updatedUser");

        when(baseUserService.updateUser(eq(1L), any(BaseUser.class))).thenReturn(updatedUser);

        mockMvc.perform(put("/api/v1/baseUser/administrator/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("updatedUser"));

        verify(baseUserService, times(1)).updateUser(eq(1L), any(BaseUser.class));
    }

    @Test
    public void testUpdateUserFailure() throws Exception {
        BaseUser updatedUser = new BaseUser();
        updatedUser.setId(1L);
        updatedUser.setUsername("updatedUser");

        when(baseUserService.updateUser(eq(1L), any(BaseUser.class))).thenThrow(new RuntimeException("Error updating user"));

        mockMvc.perform(put("/api/v1/baseUser/administrator/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(""));

        verify(baseUserService, times(1)).updateUser(eq(1L), any(BaseUser.class));
    }

    @Test
    public void testChangeUserRoleSuccess() throws Exception {
        BaseUser user = new BaseUser();
        user.setId(1L);
        user.setUsername("user1");

        when(baseUserService.changeUserRole(1L, "ADMIN")).thenReturn(user);

        mockMvc.perform(put("/api/v1/baseUser/administrator/users/1/role")
                .param("newRole", "ADMIN"))
                .andExpect(status().isOk());

        verify(baseUserService, times(1)).changeUserRole(1L, "ADMIN");
    }

    @Test
    public void testChangeUserRoleFailure() throws Exception {
        when(baseUserService.changeUserRole(1L, "ADMIN")).thenThrow(new RuntimeException("Error changing role"));

        mockMvc.perform(put("/api/v1/baseUser/administrator/users/1/role")
                .param("newRole", "ADMIN"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("Error al cambiar el rol: Error changing role"));

        verify(baseUserService, times(1)).changeUserRole(1L, "ADMIN");
    }
}
