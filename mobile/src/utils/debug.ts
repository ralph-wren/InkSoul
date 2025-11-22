/**
 * 调试工具类
 * 提供本地开发和调试相关的工具函数
 */

// 检查是否为调试模式
export const isDebugMode = (): boolean => {
  return __DEV__ || process.env.NODE_ENV === 'development';
};

// 模拟网络延迟
export const simulateNetworkDelay = (min: number = 500, max: number = 2000): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// 模拟网络错误
export const simulateNetworkError = (rate: number = 0.1): boolean => {
  return Math.random() < rate;
};

// 日志工具
export const debugLog = (...messages: any[]): void => {
  if (isDebugMode()) {
    console.log('[DEBUG]', ...messages);
  }
};

// 错误日志工具
export const debugError = (...messages: any[]): void => {
  if (isDebugMode()) {
    console.error('[ERROR]', ...messages);
  }
};

// 警告日志工具
export const debugWarn = (...messages: any[]): void => {
  if (isDebugMode()) {
    console.warn('[WARN]', ...messages);
  }
};

// 本地存储键名常量
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_PREFERENCES: 'user_preferences',
  RECENT_ARTICLES: 'recent_articles',
  OFFLINE_DATA: 'offline_data',
};

// API端点常量
export const API_ENDPOINTS = {
  BASE_URL: isDebugMode() ? 'http://localhost:8081/api' : 'https://api.inksoul.app/api',
  AUTH: '/auth',
  DIARIES: '/diaries',
  CATEGORIES: '/categories',
  TRANSCRIBE: '/transcribe',
  POLISH: '/polish',
  SUMMARY: '/summary',
};

// 默认导出
export default {
  isDebugMode,
  simulateNetworkDelay,
  simulateNetworkError,
  debugLog,
  debugError,
  debugWarn,
  STORAGE_KEYS,
  API_ENDPOINTS,
};