package com.HolosINC.Holos.security.jwt;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.HolosINC.Holos.security.service.UserDetailsImpl;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.Jwts.SIG;

@Component
public class JwtUtils {
	// private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

	@Value("${holos.jwtSecret}")
	private String jwtSecret;

	@Value("${holos.jwtExpirationMs}")
	private int jwtExpirationMs;

	private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

	public String generateJwtToken(Authentication authentication) {

		UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
		Map<String, Object> claims = new HashMap<>();
		claims.put("authorities",
				userPrincipal.getAuthorities().stream().map(auth -> auth.getAuthority()).collect(Collectors.toList()));

		return Jwts.builder().claims(claims).subject((userPrincipal.getUsername())).issuedAt(new Date())
				.expiration(new Date((new Date()).getTime() + jwtExpirationMs))
				.signWith(getSigningKey()).compact();
	}

	public String generateTokenFromUsername(String username) {
		Map<String, Object> claims = new HashMap<>();
		return Jwts.builder().claims(claims).subject(username).issuedAt(new Date())
				.expiration(new Date((new Date()).getTime() + jwtExpirationMs))
				.signWith(getSigningKey()).compact();
	}

	// public String getUserNameFromJwtToken(String token) {
    //     return Jwts.parser()
    //             .setSigningKey(getSigningKey())
    //             .build()
    //             .parseClaimsJws(token)
    //             .getBody()
    //             .getSubject();
    // }

	// public boolean validateJwtToken(String authToken) {
	// 	try {
	// 		Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
	// 		return true;
	// 	} catch (SignatureException e) {
	// 		logger.error("Invalid JWT signature: {}", e.getMessage());
	// 	} catch (MalformedJwtException e) {
	// 		logger.error("Invalid JWT token: {}", e.getMessage());
	// 	} catch (ExpiredJwtException e) {
	// 		logger.error("JWT token is expired: {}", e.getMessage());
	// 	} catch (UnsupportedJwtException e) {
	// 		logger.error("JWT token is unsupported: {}", e.getMessage());
	// 	} catch (IllegalArgumentException e) {
	// 		logger.error("JWT claims string is empty: {}", e.getMessage());
	// 	}

	// 	return false;
	// }
}