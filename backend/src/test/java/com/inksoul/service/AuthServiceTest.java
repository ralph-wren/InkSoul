package com.inksoul.service;

import com.inksoul.dto.auth.JwtAuthenticationResponse;
import com.inksoul.dto.auth.LoginRequest;
import com.inksoul.dto.auth.SignUpRequest;
import com.inksoul.dto.user.UserProfileResponse;
import com.inksoul.entity.User;
import com.inksoul.repository.UserRepository;
import com.inksoul.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * 认证服务测试
 * 
 * @author InkSoul Team
 */
@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private SignUpRequest signUpRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    public void setUp() {
        // 创建测试用户
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@example.com");
        testUser.setUsername("testuser");
        testUser.setPassword("encodedPassword");
        testUser.setDisplayName("Test User");
        testUser.setIsActive(true);
        testUser.setEmailVerified(false);

        // 创建注册请求
        signUpRequest = new SignUpRequest();
        signUpRequest.setEmail("test@example.com");
        signUpRequest.setUsername("testuser");
        signUpRequest.setPassword("password123");
        signUpRequest.setDisplayName("Test User");

        // 创建登录请求
        loginRequest = new LoginRequest();
        loginRequest.setEmailOrUsername("test@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    public void testRegisterUser_Success() {
        // 模拟依赖行为
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // 执行测试
        UserProfileResponse result = authService.registerUser(signUpRequest);

        // 验证结果
        assertNotNull(result);
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getUsername(), result.getUsername());

        // 验证方法调用
        verify(userRepository).existsByEmail(signUpRequest.getEmail());
        verify(userRepository).existsByUsername(signUpRequest.getUsername());
        verify(passwordEncoder).encode(signUpRequest.getPassword());
        verify(userRepository).save(any(User.class));
    }

    @Test
    public void testRegisterUser_EmailAlreadyExists() {
        // 模拟邮箱已存在
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.registerUser(signUpRequest);
        });

        assertTrue(exception.getMessage().contains("邮箱已被注册"));
    }

    @Test
    public void testRegisterUser_UsernameAlreadyExists() {
        // 模拟用户名已存在
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.registerUser(signUpRequest);
        });

        assertTrue(exception.getMessage().contains("用户名已被使用"));
    }

    @Test
    public void testAuthenticateUser_Success() {
        // 模拟认证成功
        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(tokenProvider.generateToken(authentication)).thenReturn("jwt-token");

        // 执行测试
        JwtAuthenticationResponse result = authService.authenticateUser(loginRequest);

        // 验证结果
        assertNotNull(result);
        assertEquals("jwt-token", result.getAccessToken());
        assertEquals("Bearer", result.getTokenType());

        // 验证方法调用
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(tokenProvider).generateToken(authentication);
    }

    @Test
    public void testIsEmailAvailable_Available() {
        // 模拟邮箱可用
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        // 执行测试
        boolean result = authService.isEmailAvailable("test@example.com");

        // 验证结果
        assertTrue(result);
    }

    @Test
    public void testIsEmailAvailable_NotAvailable() {
        // 模拟邮箱不可用
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // 执行测试
        boolean result = authService.isEmailAvailable("test@example.com");

        // 验证结果
        assertFalse(result);
    }

    @Test
    public void testIsUsernameAvailable_Available() {
        // 模拟用户名可用
        when(userRepository.existsByUsername(anyString())).thenReturn(false);

        // 执行测试
        boolean result = authService.isUsernameAvailable("testuser");

        // 验证结果
        assertTrue(result);
    }

    @Test
    public void testIsUsernameAvailable_NotAvailable() {
        // 模拟用户名不可用
        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        // 执行测试
        boolean result = authService.isUsernameAvailable("testuser");

        // 验证结果
        assertFalse(result);
    }
}