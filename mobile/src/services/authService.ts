/**
 * 认证服务
 */

import { ApiService } from './api';
import {
  LoginRequest,
  SignUpRequest,
  JwtAuthenticationResponse,
  UserProfile,
  ApiResponse,
} from '../types/auth';

export class AuthService {
  /**
   * 用户登录
   */
  static async login(credentials: LoginRequest): Promise<JwtAuthenticationResponse> {
    const response = await ApiService.post<ApiResponse<JwtAuthenticationResponse>>(
      '/auth/login',
      credentials
    );
    
    if (response.success && response.data) {
      // 保存令牌
      await ApiService.setAuthToken(response.data.accessToken);
      return response.data;
    }
    
    throw new Error(response.message || '登录失败');
  }

  /**
   * 用户注册
   */
  static async register(userData: SignUpRequest): Promise<UserProfile> {
    const response = await ApiService.post<ApiResponse<UserProfile>>(
      '/auth/register',
      userData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || '注册失败');
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<void> {
    try {
      await ApiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // 无论API调用是否成功，都清除本地令牌
      await ApiService.removeAuthToken();
    }
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<UserProfile> {
    const response = await ApiService.get<ApiResponse<UserProfile>>('/users/me');
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || '获取用户信息失败');
  }

  /**
   * 更新用户资料
   */
  static async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await ApiService.put<ApiResponse<UserProfile>>(
      '/users/me',
      profileData
    );
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || '更新用户资料失败');
  }

  /**
   * 修改密码
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const response = await ApiService.put<ApiResponse<void>>('/users/me/password', {
      currentPassword,
      newPassword,
    });
    
    if (!response.success) {
      throw new Error(response.message || '修改密码失败');
    }
  }

  /**
   * 检查邮箱是否可用
   */
  static async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await ApiService.get<ApiResponse<{ available: boolean }>>(
      `/auth/check-email?email=${encodeURIComponent(email)}`
    );
    
    return response.data?.available || false;
  }

  /**
   * 检查用户名是否可用
   */
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    const response = await ApiService.get<ApiResponse<{ available: boolean }>>(
      `/auth/check-username?username=${encodeURIComponent(username)}`
    );
    
    return response.data?.available || false;
  }

  /**
   * 刷新令牌
   */
  static async refreshToken(): Promise<JwtAuthenticationResponse> {
    const response = await ApiService.post<ApiResponse<JwtAuthenticationResponse>>(
      '/auth/refresh'
    );
    
    if (response.success && response.data) {
      // 更新令牌
      await ApiService.setAuthToken(response.data.accessToken);
      return response.data;
    }
    
    throw new Error(response.message || '刷新令牌失败');
  }
}