package com.HolosINC.Holos.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

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
import com.HolosINC.Holos.model.BaseUser;
import com.HolosINC.Holos.model.BaseUserRepository;
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
    private BaseUserRepository baseUserRepository;

    @Mock
    private ClientService clientService;

    @Mock
    private ImageHandler imageHandler;

    @InjectMocks
    private AuthoritiesService authoritiesService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        authoritiesService = new AuthoritiesService(encoder, baseUserService, artistService, clientService, imageHandler);

        ReflectionTestUtils.setField(authoritiesService, "imageHandler", imageHandler);
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

        when(encoder.encode("password")).thenReturn("encodedPassword");
        when(imageHandler.getBytes(any())).thenReturn(new byte[0]);

        authoritiesService.createUser(request);

        verify(baseUserService, times(1)).save(any(BaseUser.class));
        verify(artistService, times(1)).saveArtist(any(Artist.class));
    }

    @Test
    public void testDeleteUserSuccessForArtist() throws Exception {
        BaseUser user = new BaseUser();

        user.setId(1L);
        user.setAuthority(Auth.ARTIST);

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
        user.setAuthority(Auth.CLIENT);

        when(baseUserService.findCurrentUser()).thenReturn(user);

        assertThrows(AccessDeniedException.class, () -> {
            authoritiesService.deleteUser(1L);
        });

        verify(baseUserService, never()).delete(anyLong());
    }

    @Test
    public void testDeleteUserAdminNotAllowed() {
        BaseUser user = new BaseUser();

        user.setId(1L);
        user.setAuthority(Auth.ADMIN);

        when(baseUserService.findCurrentUser()).thenReturn(user);

        assertThrows(AccessDeniedException.class, () -> {
            authoritiesService.deleteUser(1L);
        });

        verify(baseUserService, never()).delete(anyLong());
    }
}
