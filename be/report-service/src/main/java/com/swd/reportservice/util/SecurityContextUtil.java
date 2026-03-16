package com.swd.reportservice.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

public final class SecurityContextUtil {
    private SecurityContextUtil() {}

    public static String currentEmailOrUnknown() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) return "unknown";
        return String.valueOf(auth.getPrincipal());
    }

    public static List<String> currentRoles() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return List.of();
        return auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
    }
}

