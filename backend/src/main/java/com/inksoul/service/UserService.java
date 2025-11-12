package com.inksoul.service;

import com.inksoul.dto.auth.SignUpRequest;
import com.inksoul.entity.User;
import com.inksoul.entity.UserPreferences;
import com.inksoul.repository.UserRepository;
import com.inksoul.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 用户服务
 * 
 * @author InkSoul Team
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 创建新用户
     */
    @Transactional
    public User createUser(SignUpRequest signUpRequest) {
        // 检查邮箱是否已存在
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("邮箱已被注册");
        }

        // 检查用户名是否已存在
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new BadRequestException("用户名已被使用");
        }

        // 创建用户
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setDisplayName(signUpRequest.getDisplayName() != null ? 
                           signUpRequest.getDisplayName() : signUpRequest.getUsername());
        user.setIsActive(true);
        user.setEmailVerified(false); // 实际应用中需要邮箱验证

        // 保存用户
        User savedUser = userRepository.save(user);

        // 创建用户偏好设置
        UserPreferences preferences = new UserPreferences(savedUser);
        savedUser.setPreferences(preferences);

        return savedUser;
    }

    /**
     * 根据ID查找用户
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * 根据邮箱查找用户
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * 根据用户名查找用户
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * 根据邮箱或用户名查找用户
     */
    public Optional<User> findByEmailOrUsername(String emailOrUsername) {
        return userRepository.findByEmailOrUsername(emailOrUsername);
    }

    /**
     * 更新用户信息
     */
    @Transactional
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    /**
     * 验证邮箱
     */
    @Transactional
    public void verifyEmail(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("用户不存在"));
        
        user.setEmailVerified(true);
        userRepository.save(user);
    }

    /**
     * 检查邮箱是否可用
     */
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    /**
     * 检查用户名是否可用
     */
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }
}