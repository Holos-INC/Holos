package com.HolosINC.Holos.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import com.HolosINC.Holos.artist.Artist;
import com.HolosINC.Holos.artist.ArtistService;
import com.HolosINC.Holos.auth.payload.request.SignupRequest;
import com.HolosINC.Holos.client.ClientService;
import com.HolosINC.Holos.exceptions.AccessDeniedException;
import com.HolosINC.Holos.exceptions.ResourceNotFoundException;
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserService;
import com.HolosINC.Holos.util.ImageHandler;

public class AuthoritiesServiceTest {

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private BaseUserService baseUserService;

    @Mock
    private ArtistService artistService;

    @Mock
    private ClientService clientService;

    @Mock
    private AuthoritiesRepository authoritiesRepository;

    @Mock
    private ImageHandler imageHandler;

    @InjectMocks
    private AuthoritiesService authoritiesService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        authoritiesService = new AuthoritiesService(
                encoder, baseUserService, artistService,
                clientService, authoritiesRepository);

        ReflectionTestUtils.setField(authoritiesService, "imageHandler", imageHandler);
    }

    @Test
    public void testFindByAuthoritySuccess() {
        Authorities authority = new Authorities();
        authority.setAuthority("ADMIN");

        when(authoritiesRepository.findByName("ADMIN")).thenReturn(Optional.of(authority));

        Authorities result = authoritiesService.findByAuthority("ADMIN");

        assertNotNull(result);
        assertEquals("ADMIN", result.getAuthority());
        verify(authoritiesRepository, times(1)).findByName("ADMIN");
    }

    @Test
    public void testFindByAuthorityNotFound() {
        when(authoritiesRepository.findByName("UNKNOWN")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            authoritiesService.findByAuthority("UNKNOWN");
        });

        verify(authoritiesRepository, times(1)).findByName("UNKNOWN");
    }

    @Test
    public void testCreateUserSuccessForArtist() throws Exception {
        SignupRequest request = new SignupRequest();
        request.setUsername("artistUser");
        request.setPassword("password");
        request.setEmail("artist@example.com");
        request.setAuthority("ARTIST");
        request.setFirstName("Artist");
        request.setPhoneNumber("123456789");

        MultipartFile mockImage = mock(MultipartFile.class);
        MultipartFile mockTable = mock(MultipartFile.class);

        when(mockImage.getSize()).thenReturn(1024L);
        when(mockImage.isEmpty()).thenReturn(false);
        when(mockTable.getSize()).thenReturn(1024L);
        when(mockTable.isEmpty()).thenReturn(false);
        when(mockTable.getBytes()).thenReturn(new byte[0]);

        request.setImageProfile(mockImage);
        request.setTableCommisionsPrice(mockTable);

        Authorities authority = new Authorities();
        authority.setAuthority("ARTIST");

        when(authoritiesRepository.findByName("ARTIST")).thenReturn(Optional.of(authority));
        when(encoder.encode("password")).thenReturn("encodedPassword");
        when(imageHandler.getBytes(any())).thenReturn(new byte[0]);

        authoritiesService.createUser(request);

        verify(baseUserService, times(1)).save(any(BaseUser.class));
        verify(artistService, times(1)).saveArtist(any(Artist.class));
    }

    @Test
    public void testCreateUserUsernameExists() {
        SignupRequest request = new SignupRequest();
        request.setUsername("existingUser");
        request.setEmail("existing@example.com");

        when(authoritiesRepository.existsBaseUserByUsername("existingUser")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> {
            authoritiesService.createUser(request);
        });

        verify(authoritiesRepository, times(1)).existsBaseUserByUsername("existingUser");
    }

    @Test
    public void testDeleteUserSuccessForArtist() throws Exception {
        BaseUser user = new BaseUser();
        Authorities authority = new Authorities();
        authority.setAuthority("ARTIST");

        user.setId(1L);
        user.setAuthority(authority);

        Artist artist = new Artist();
        artist.setId(1L);

        when(baseUserService.findCurrentUser()).thenReturn(user);
        when(artistService.findArtist(1L)).thenReturn(artist);

        authoritiesService.deleteUser(1L);

        verify(artistService, times(1)).deleteArtist(1L);
        verify(baseUserService, times(1)).delete(1L);
    }

    @Test
    public void testDeleteUserAccessDenied() {
        BaseUser user = new BaseUser();
        user.setId(2L);
        user.setAuthority(authoritiesRepository.findByName("CLIENT").orElse(null));

        when(baseUserService.findCurrentUser()).thenReturn(user);

        assertThrows(AccessDeniedException.class, () -> {
            authoritiesService.deleteUser(1L);
        });

        verify(baseUserService, never()).delete(anyLong());
    }

    @Test
    public void testDeleteUserAdminNotAllowed() {
        BaseUser user = new BaseUser();
        Authorities authority = new Authorities();
        authority.setAuthority("ADMIN");

        user.setId(1L);
        user.setAuthority(authority);

        when(baseUserService.findCurrentUser()).thenReturn(user);

        assertThrows(AccessDeniedException.class, () -> {
            authoritiesService.deleteUser(1L);
        });

        verify(baseUserService, never()).delete(anyLong());
    }
}
