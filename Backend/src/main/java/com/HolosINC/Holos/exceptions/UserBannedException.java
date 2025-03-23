package com.HolosINC.Holos.exceptions;

import org.springframework.security.core.AuthenticationException;

public class UserBannedException extends AuthenticationException {
    public UserBannedException(String message) {
        super(message);
    }
}
