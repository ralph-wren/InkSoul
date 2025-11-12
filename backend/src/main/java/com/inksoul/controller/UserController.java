package com.inksoul.controller;

import com.inksoul.dto.ApiResponse;
import com.inksoul.dto.user.UserProfileResponse;
import com.inksoul.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

/**
 * 用户控制器
 * 
 * @author InkSoul Team
 */
@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('USER')")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    /**
     * 获取当前用户资料
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser() {
        try {
            UserProfileResponse userProfile = userService.getCurrentUserProfile();
            return ResponseEntity.ok(ApiResponse.success(userProfile));
        } catch (Exception e) {
            logger.error("Failed to get current user profile", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("获取用户资料失败：" + e.getMessage()));
        }
    }

    /**
     * 更新用户资料
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateCurrentUser(@Valid @RequestBody UserProfileResponse updateRequest) {
        try {
            UserProfileResponse updatedProfile = userService.updateUserProfile(updateRequest);
            return ResponseEntity.ok(ApiResponse.success("用户资料更新成功", updatedProfile));
        } catch (Exception e) {
            logger.error("Failed to update user profile", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("更新用户资料失败：" + e.getMessage()));
        }
    }

    /**
     * 更新用户头像
     */
    @PutMapping("/me/avatar")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserAvatar(@RequestBody Map<String, String> request) {
        try {
            String avatarUrl = request.get("avatarUrl");
            UserProfileResponse updatedProfile = userService.updateUserAvatar(avatarUrl);
            return ResponseEntity.ok(ApiResponse.success("头像更新成功", updatedProfile));
        } catch (Exception e) {
            logger.error("Failed to update user avatar", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("更新头像失败：" + e.getMessage()));
        }
    }

    /**
     * 修改密码
     */
    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody Map<String, String> request) {
        try {
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            
            if (currentPassword == null || newPassword == null) {
                throw new IllegalArgumentException("当前密码和新密码不能为空");
            }
            
            userService.changePassword(currentPassword, newPassword);
            return ResponseEntity.ok(ApiResponse.success("密码修改成功", null));
        } catch (Exception e) {
            logger.error("Failed to change password", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("修改密码失败：" + e.getMessage()));
        }
    }

    /**
     * 获取用户统计信息
     */
    @GetMapping("/me/stats")
    public ResponseEntity<ApiResponse<UserService.UserStatsResponse>> getUserStats() {
        try {
            UserService.UserStatsResponse stats = userService.getUserStats();
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            logger.error("Failed to get user stats", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("获取统计信息失败：" + e.getMessage()));
        }
    }

    /**
     * 停用账户
     */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deactivateAccount() {
        try {
            userService.deactivateAccount();
            return ResponseEntity.ok(ApiResponse.success("账户已停用", null));
        } catch (Exception e) {
            logger.error("Failed to deactivate account", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("停用账户失败：" + e.getMessage()));
        }
    }
}