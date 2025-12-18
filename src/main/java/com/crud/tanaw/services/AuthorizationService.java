package com.crud.tanaw.services;

import com.crud.tanaw.exceptions.ForbiddenException;
import com.crud.tanaw.exceptions.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

@Service
public class AuthorizationService {

    /**
     * Check if the current user has any of the specified roles
     * @param allowedRoles List of roles that are allowed
     * @throws UnauthorizedException if user is not authenticated
     * @throws ForbiddenException if user doesn't have required role
     */
    public void requireRole(String... allowedRoles) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("Authentication required to access this resource");
        }

        // Get user roles
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        List<String> userRoles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", "")) // Remove ROLE_ prefix if present
                .toList();

        // Check if user has any of the allowed roles
        boolean hasRole = Arrays.stream(allowedRoles)
                .anyMatch(userRoles::contains);

        if (!hasRole) {
            String requiredRoles = String.join(", ", allowedRoles);
            throw new ForbiddenException(
                    "Access denied. Required role(s): " + requiredRoles +
                            ". Your role(s): " + String.join(", ", userRoles)
            );
        }
    }

    /**
     * Check if the current user is an admin
     */
    public void requireAdmin() {
        requireRole("ADMIN");
    }

    /**
     * Check if the current user is a citizen
     */
    public void requireCitizen() {
        requireRole("CITIZEN");
    }


    /**
     * Get the current authenticated user's email
     */
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("No authenticated user found");
        }
        return authentication.getName();
    }

    /**
     * Get the current authenticated user's role
     */
    public String getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("No authenticated user found");
        }

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(role -> role.replace("ROLE_", ""))
                .findFirst()
                .orElse("UNKNOWN");
    }

    /**
     * Check if current user has a specific role
     */
    public boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(r -> r.replace("ROLE_", ""))
                .anyMatch(r -> r.equals(role));
    }
}