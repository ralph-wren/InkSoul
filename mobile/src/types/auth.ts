/**
 * 认证相关类型定义
 */

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface JwtAuthenticationResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  timezone?: string;
  writingStyle?: string;
  emailVerified: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}