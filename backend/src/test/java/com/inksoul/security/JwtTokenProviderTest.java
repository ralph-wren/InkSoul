package com.inksoul.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

/**
 * JWT令牌提供者测试
 * 
 * @author InkSoul Team
 */
public class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private UserPrincipal userPrincipal;
    private Authentication authentication;

    @BeforeEach
    public void setUp() {
        jwtTokenProvider = new JwtTokenProvider();
        
        // 设置测试配置
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtSecret", "testSecretKeyForJWTTokenGeneration2024");
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpirationInMs", 86400000L); // 24小时
        
        // 初始化
        jwtTokenProvider.init();
        
        // 创建测试用户主体
        userPrincipal = new UserPrincipal(
            1L,
            "test@example.com",
            "testuser",
            "password",
            true,
            true,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
        
        authentication = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());
    }

    @Test
    public void testGenerateToken() {
        // 生成令牌
        String token = jwtTokenProvider.generateToken(authentication);
        
        // 验证令牌不为空
        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    public void testGetUserIdFromJWT() {
        // 生成令牌
        String token = jwtTokenProvider.generateToken(authentication);
        
        // 从令牌中获取用户ID
        Long userId = jwtTokenProvider.getUserIdFromJWT(token);
        
        // 验证用户ID正确
        assertEquals(userPrincipal.getId(), userId);
    }

    @Test
    public void testValidateToken_ValidToken() {
        // 生成令牌
        String token = jwtTokenProvider.generateToken(authentication);
        
        // 验证令牌
        boolean isValid = jwtTokenProvider.validateToken(token);
        
        // 验证结果为真
        assertTrue(isValid);
    }

    @Test
    public void testValidateToken_InvalidToken() {
        // 使用无效令牌
        String invalidToken = "invalid.jwt.token";
        
        // 验证令牌
        boolean isValid = jwtTokenProvider.validateToken(invalidToken);
        
        // 验证结果为假
        assertFalse(isValid);
    }

    @Test
    public void testGetExpirationDateFromJWT() {
        // 生成令牌
        String token = jwtTokenProvider.generateToken(authentication);
        
        // 获取过期时间
        Date expirationDate = jwtTokenProvider.getExpirationDateFromJWT(token);
        
        // 验证过期时间在未来
        assertTrue(expirationDate.after(new Date()));
    }

    @Test
    public void testIsTokenExpiringSoon() {
        // 生成令牌
        String token = jwtTokenProvider.generateToken(authentication);
        
        // 检查令牌是否即将过期（新生成的令牌不应该即将过期）
        boolean expiringSoon = jwtTokenProvider.isTokenExpiringSoon(token);
        
        // 验证结果为假
        assertFalse(expiringSoon);
    }
}