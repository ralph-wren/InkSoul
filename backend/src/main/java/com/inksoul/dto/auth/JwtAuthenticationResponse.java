package com.inksoul.dto.auth;

/**
 * JWT认证响应DTO
 * 
 * @author InkSoul Team
 */
public class JwtAuthenticationResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserSummary user;

    public JwtAuthenticationResponse(String accessToken, Long expiresIn, UserSummary user) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    // Getters and Setters
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public UserSummary getUser() {
        return user;
    }

    public void setUser(UserSummary user) {
        this.user = user;
    }

    /**
     * 用户摘要信息
     */
    public static class UserSummary {
        private Long id;
        private String username;
        private String email;
        private String displayName;
        private String avatarUrl;

        public UserSummary(Long id, String username, String email, String displayName, String avatarUrl) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.displayName = displayName;
            this.avatarUrl = avatarUrl;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }
    }
}