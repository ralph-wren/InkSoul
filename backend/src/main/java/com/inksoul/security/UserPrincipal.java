package com.inksoul.security;

import com.inksoul.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;

/**
 * Spring Security用户主体
 * 
 * @author InkSoul Team
 */
public class UserPrincipal implements UserDetails {
    
    private Long id;
    private String email;
    private String username;
    private String password;
    private boolean isActive;
    private boolean emailVerified;

    public UserPrincipal(Long id, String email, String username, String password, 
                        boolean isActive, boolean emailVerified) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.password = password;
        this.isActive = isActive;
        this.emailVerified = emailVerified;
    }

    public static UserPrincipal create(User user) {
        return new UserPrincipal(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getPassword(),
            user.getIsActive(),
            user.getEmailVerified()
        );
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 目前只有用户角色，后续可以扩展更多角色
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive && emailVerified;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPrincipal that = (UserPrincipal) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}