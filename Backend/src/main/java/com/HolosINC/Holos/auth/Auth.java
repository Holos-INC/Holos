package com.HolosINC.Holos.auth;

public enum Auth {
    ARTIST,
    ADMIN,
    CLIENT,
    ARTIST_PREMIUM,;

    String getAuthority() {
        throw new UnsupportedOperationException("Unimplemented method 'getAuthority'");
    }
}
