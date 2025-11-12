package com.inksoul.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inksoul.dto.auth.LoginRequest;
import com.inksoul.dto.auth.SignUpRequest;
import com.inksoul.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 认证控制器测试
 * 
 * @author InkSoul Team
 */
@WebMvcTest(AuthController.class)
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testRegisterUser_Success() throws Exception {
        // 准备测试数据
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setEmail("test@example.com");
        signUpRequest.setUsername("testuser");
        signUpRequest.setPassword("password123");
        signUpRequest.setDisplayName("Test User");

        // 模拟服务层行为
        when(authService.registerUser(any(SignUpRequest.class)))
                .thenReturn(null); // 简化返回值

        // 执行测试
        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("注册成功，请验证邮箱后登录"));
    }

    @Test
    public void testRegisterUser_ValidationError() throws Exception {
        // 准备无效的测试数据
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setEmail("invalid-email");
        signUpRequest.setUsername(""); // 空用户名
        signUpRequest.setPassword("123"); // 密码太短

        // 执行测试
        mockMvc.perform(post("/auth/register")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    public void testLogin_Success() throws Exception {
        // 准备测试数据
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmailOrUsername("test@example.com");
        loginRequest.setPassword("password123");

        // 执行测试
        mockMvc.perform(post("/auth/login")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("登录成功"));
    }

    @Test
    public void testCheckEmailAvailability() throws Exception {
        // 模拟服务层行为
        when(authService.isEmailAvailable("test@example.com")).thenReturn(true);

        // 执行测试
        mockMvc.perform(get("/auth/check-email")
                .param("email", "test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.available").value(true));
    }

    @Test
    public void testCheckUsernameAvailability() throws Exception {
        // 模拟服务层行为
        when(authService.isUsernameAvailable("testuser")).thenReturn(false);

        // 执行测试
        mockMvc.perform(get("/auth/check-username")
                .param("username", "testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.available").value(false));
    }

    @Test
    @WithMockUser
    public void testLogout() throws Exception {
        // 执行测试
        mockMvc.perform(post("/auth/logout")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("登出成功"));
    }
}