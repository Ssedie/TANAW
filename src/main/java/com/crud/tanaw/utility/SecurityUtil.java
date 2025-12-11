package com.crud.tanaw.utility;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

public class SecurityUtil {
    public static Integer getCurrentUserId(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        return Integer.valueOf(jwt.getSubject());
    }

    public static String getCurrentUserRole(Authentication auth) {
        Jwt jwt = (Jwt) auth.getPrincipal();
        return jwt.getClaimAsString("role");
    }
    public static boolean isAdmin(Authentication auth) {
        return "ADMIN".equals(getCurrentUserRole(auth));
    }
}
