package com.HolosINC.Holos.model;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;
import java.util.List;
import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.auth.Authorities;
import com.HolosINC.Holos.auth.AuthoritiesRepository;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

public class BaseUserServiceTest {

    @Mock
    private BaseUserRepository baseUserRepository;

    @Mock
    private AuthoritiesRepository authoritiesRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private BaseUserService baseUserService;

    private BaseUser user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new BaseUser();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("password");
        user.setEmail("test@example.com");
    }

    @Test
    public void testSaveUser() {
        when(baseUserRepository.save(user)).thenReturn(user);

        BaseUser savedUser = baseUserService.save(user);

        assertNotNull(savedUser);
        assertEquals(user.getId(), savedUser.getId());
        verify(baseUserRepository, times(1)).save(user);
    }

    @Test
    public void testLoginSuccess() {
        when(baseUserRepository.login("testuser", "password")).thenReturn(Optional.of(user));

        BaseUser loggedInUser = baseUserService.login("testuser", "password");

        assertNotNull(loggedInUser);
        assertEquals(user.getUsername(), loggedInUser.getUsername());
        verify(baseUserRepository, times(1)).login("testuser", "password");
    }

    @Test
    public void testLoginFailure() {
        when(baseUserRepository.login("testuser", "wrongpassword")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> {
            baseUserService.login("testuser", "wrongpassword");
        });

        verify(baseUserRepository, times(1)).login("testuser", "wrongpassword");
    }

    @Test
    public void testExistsUser() {
        when(baseUserRepository.findUserByUsername("testuser")).thenReturn(Optional.of(user));

        Boolean exists = baseUserService.existsUser("testuser");

        assertTrue(exists);
        verify(baseUserRepository, times(1)).findUserByUsername("testuser");
    }

    @Test
    public void testFindByIdSuccess() {
        when(baseUserRepository.findById(1L)).thenReturn(Optional.of(user));

        BaseUser foundUser = baseUserService.findById(1L);

        assertNotNull(foundUser);
        assertEquals(user.getId(), foundUser.getId());
        verify(baseUserRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindByIdNotFound() {
        when(baseUserRepository.findById(1L)).thenReturn(Optional.empty());

        BaseUser foundUser = baseUserService.findById(1L);

        assertNull(foundUser);
        verify(baseUserRepository, times(1)).findById(1L);
    }

    @Test
    public void testFindCurrentUserSuccess() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        when(baseUserRepository.findUserByUsername("testuser")).thenReturn(Optional.of(user));

        BaseUser currentUser = baseUserService.findCurrentUser();

        assertNotNull(currentUser);
        assertEquals(user.getUsername(), currentUser.getUsername());
        verify(baseUserRepository, times(1)).findUserByUsername("testuser");
    }

    @Test
    public void testFindCurrentUserNotLoggedIn() {
        when(securityContext.getAuthentication()).thenReturn(null);
        SecurityContextHolder.setContext(securityContext);

        assertThrows(ResourceNotFoundException.class, () -> {
            baseUserService.findCurrentUser();
        });

        verify(baseUserRepository, never()).findUserByUsername(anyString());
    }

    @Test
    public void testDeleteUserSuccess() {
        when(baseUserRepository.findById(1L)).thenReturn(Optional.of(user));

        BaseUser deletedUser = baseUserService.delete(1L);

        assertNotNull(deletedUser);
        assertEquals(user.getId(), deletedUser.getId());
        verify(baseUserRepository, times(1)).delete(user);
    }

    @Test
    public void testDeleteUserNotFound() {
        when(baseUserRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            baseUserService.delete(1L);
        });

        verify(baseUserRepository, never()).delete(any(BaseUser.class));
    }

    @Test
    public void testFindArtistSuccess() {
        Artist artist = new Artist();
        artist.setId(1L);
        when(baseUserRepository.findArtist(1L)).thenReturn(Optional.of(artist));

        Artist foundArtist = baseUserService.findArtist(1L);

        assertNotNull(foundArtist);
        assertEquals(artist.getId(), foundArtist.getId());
        verify(baseUserRepository, times(1)).findArtist(1L);
    }

    @Test
    public void testFindArtistNotFound() {
        when(baseUserRepository.findArtist(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            baseUserService.findArtist(1L);
        });

        verify(baseUserRepository, times(1)).findArtist(1L);
    }

    @Test
    public void testGetAllUsers() {
        List<BaseUser> users = Arrays.asList(user);
        when(baseUserRepository.findAll()).thenReturn(users);

        List<BaseUser> allUsers = baseUserService.getAllUsers();

        assertNotNull(allUsers);
        assertEquals(1, allUsers.size());
        verify(baseUserRepository, times(1)).findAll();
    }

    @Test
    public void testUpdateUserSuccess() {
        BaseUser updatedUser = new BaseUser();
        updatedUser.setName("Updated Name");
        updatedUser.setUsername("updateduser");
        updatedUser.setEmail("updated@example.com");

        when(baseUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(baseUserRepository.save(any(BaseUser.class))).thenReturn(updatedUser);

        BaseUser result = baseUserService.updateUser(1L, updatedUser);

        assertNotNull(result);
        assertEquals("Updated Name", result.getName());
        verify(baseUserRepository, times(1)).save(any(BaseUser.class));
    }

    @Test
    public void testUpdateUserNotFound() {
        BaseUser updatedUser = new BaseUser();
        when(baseUserRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            baseUserService.updateUser(1L, updatedUser);
        });

        verify(baseUserRepository, never()).save(any(BaseUser.class));
    }

    @Test
    public void testChangeUserRoleSuccess() {
        Authorities authority = new Authorities();
        authority.setAuthority("ADMIN");

        when(baseUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(authoritiesRepository.findByName("ADMIN")).thenReturn(Optional.of(authority));
        when(baseUserRepository.save(any(BaseUser.class))).thenReturn(user);

        BaseUser result = baseUserService.changeUserRole(1L, "ADMIN");

        assertNotNull(result);
        assertEquals(authority, result.getAuthority());
        verify(baseUserRepository, times(1)).save(any(BaseUser.class));
    }

    @Test
    public void testChangeUserRoleUserNotFound() {
        when(baseUserRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            baseUserService.changeUserRole(1L, "ADMIN");
        });

        verify(baseUserRepository, never()).save(any(BaseUser.class));
    }

    @Test
    public void testChangeUserRoleAuthorityNotFound() {
        when(baseUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(authoritiesRepository.findByName("ADMIN")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            baseUserService.changeUserRole(1L, "ADMIN");
        });

        verify(baseUserRepository, never()).save(any(BaseUser.class));
    }
}
