package com.inksoul.controller;

import com.inksoul.dto.ApiResponse;
import com.inksoul.dto.auth.JwtAuthenticationResponse;
import com.inksoul.dto.auth.LoginRequest;
import com.inksoul.dto.auth.SignUpRequest;
import com.inksoul.dto.user.UserProfileResponse;
import com.inksoul.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 * 
 * @author InkSoul Team
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtAuthenticationResponse>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtAuthenticationResponse response = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("登录成功", response));
        } catch (Exception e) {
            logger.error("Login failed for user: {}", loginRequest.getEmailOrUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("登录失败：用户名或密码错误"));
        }
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserProfileResponse>> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            UserProfileResponse userProfile = authService.registerUser(signUpRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("注册成功，请验证邮箱后登录", userProfile));
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", signUpRequest.getUsername(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("注册失败：" + e.getMessage()));
        }
    }

    /**
     * 检查邮箱是否可用
     */
    @GetMapping("/check-email")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkEmailAvailability(@RequestParam String email) {
        boolean available = authService.isEmailAvailable(email);
        
        Map<String, Boolean> result = new HashMap<>();
        result.put("available", available);
        
        String message = available ? "邮箱可用" : "邮箱已被注册";
        return ResponseEntity.ok(ApiResponse.success(message, result));
    }

    /**
     * 检查用户名是否可用
     */
    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkUsernameAvailability(@RequestParam String username) {
        boolean available = authService.isUsernameAvailable(username);
        
        Map<String, Boolean> result = new HashMap<>();
        result.put("available", available);
        
        String message = available ? "用户名可用" : "用户名已被使用";
        return ResponseEntity.ok(ApiResponse.success(message, result));
    }

    /**
     * 刷新JWT令牌
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<JwtAuthenticationResponse>> refreshToken(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // 移除 "Bearer " 前缀
            JwtAuthenticationResponse response = authService.refreshToken(token);
            return ResponseEntity.ok(ApiResponse.success("令牌刷新成功", response));
        } catch (Exception e) {
            logger.error("Token refresh failed", e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("令牌刷新失败：" + e.getMessage()));
        }
    }

    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logoutUser() {
        // JWT是无状态的，客户端删除令牌即可
        // 这里可以实现令牌黑名单机制
        return ResponseEntity.ok(ApiResponse.success("登出成功", null));
    }
}