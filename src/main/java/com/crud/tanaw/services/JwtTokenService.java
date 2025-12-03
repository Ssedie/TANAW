package com.crud.tanaw.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtTokenService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;

    public JwtTokenService(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder) {
        this.jwtEncoder = jwtEncoder;
        this.jwtDecoder = jwtDecoder;
    }

    // Existing method for normal users
    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();
        long expiresIn = 24 * 60 * 60;

        String userId = authentication.getName();

        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("CITIZEN");

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(userId)
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiresIn))
                .claim("role", role)
                .build();

        var header = org.springframework.security.oauth2.jwt.JwsHeader
                .with(MacAlgorithm.HS256)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims))
                .getTokenValue();
    }

    // New method for super admin or manual JWT creation
    public String generateToken(Long userId, String role) {
        Instant now = Instant.now();
        long expiresIn = 24 * 60 * 60;

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(String.valueOf(userId))
                .issuer("self")
                .issuedAt(now)
                .expiresAt(now.plusSeconds(expiresIn))
                .claim("role", role)
                .build();

        var header = org.springframework.security.oauth2.jwt.JwsHeader
                .with(MacAlgorithm.HS256)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims))
                .getTokenValue();
    }

    public Long extractExpirationTime(String token) {
        Jwt jwt = jwtDecoder.decode(token);
        return jwt.getExpiresAt().getEpochSecond();
    }
}
