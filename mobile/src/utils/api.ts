/**
 * API 工具类
 * 用于与后端服务进行通信
 */

// 模拟网络延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取基础URL
const getBaseUrl = () => {
  // 在调试环境中使用本地服务器
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'http://localhost:8081/api';
  }
  // 生产环境中使用实际服务器地址
  return 'https://api.inksoul.app/api';
};

// API 配置
const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
};

// 模拟API响应类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

// 日记相关接口
export interface Diary {
  id: string;
  title: string;
  content: string;
  polishedContent: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// 分类相关接口
export interface Category {
  id: string;
  name: string;
  count: number;
}

// 语音转文字请求
export interface TranscribeRequest {
  audioFile: string;
}

// 语音转文字响应
export interface TranscribeResponse {
  text: string;
}

// AI润色请求
export interface PolishRequest {
  text: string;
}

// AI润色响应
export interface PolishResponse {
  polishedText: string;
}

// 文章总结请求
export interface SummaryRequest {
  categoryId: string;
  style: 'chronological' | 'biographical';
}

// 文章总结响应
export interface SummaryResponse {
  summaryText: string;
}

/**
 * 模拟语音转文字API
 * @param audioFile 音频文件路径
 * @returns 转录后的文本
 */
export const transcribeAudio = async (audioFile: string): Promise<ApiResponse<TranscribeResponse>> => {
  // 模拟网络请求延迟
  await delay(1500);
  
  // 模拟转录结果
  return {
    success: true,
    data: {
      text: '今天天气真好，我和朋友一起去公园散步。我们聊了很多有趣的话题，感觉非常愉快。这样的日子让人感到生活很美好。'
    }
  };
};

/**
 * 模拟AI润色API
 * @param text 原始文本
 * @returns 润色后的文本
 */
export const polishText = async (text: string): Promise<ApiResponse<PolishResponse>> => {
  // 模拟网络请求延迟
  await delay(2000);
  
  // 模拟润色结果
  return {
    success: true,
    data: {
      polishedText: `今天阳光明媚，微风轻拂，我和好友相约前往公园漫步。我们畅谈了许多饶有趣味的话题，心情格外愉悦。这样美好的时光让人深深感受到生活的精彩与美好。\n\n此次出行不仅放松了身心，也增进了友谊，实在是一次难忘的经历。`
    }
  };
};

/**
 * 模拟获取文章分类API
 * @returns 分类列表
 */
export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  // 模拟网络请求延迟
  await delay(500);
  
  // 模拟分类数据
  return {
    success: true,
    data: [
      { id: '1', name: '工作', count: 12 },
      { id: '2', name: '生活', count: 24 },
      { id: '3', name: '旅行', count: 8 },
      { id: '4', name: '情感', count: 15 },
      { id: '5', name: '学习', count: 18 },
    ]
  };
};

/**
 * 模拟获取文章列表API
 * @returns 文章列表
 */
export const getArticles = async (): Promise<ApiResponse<Diary[]>> => {
  // 模拟网络请求延迟
  await delay(800);
  
  // 模拟文章数据
  return {
    success: true,
    data: [
      { 
        id: '1', 
        title: '项目成功上线的喜悦', 
        content: '原始内容...', 
        polishedContent: '润色后的内容...',
        category: '工作', 
        createdAt: '2023-06-15T10:30:00Z',
        updatedAt: '2023-06-15T11:45:00Z'
      },
      { 
        id: '2', 
        title: '周末的家庭聚餐', 
        content: '原始内容...', 
        polishedContent: '润色后的内容...',
        category: '生活', 
        createdAt: '2023-06-12T18:20:00Z',
        updatedAt: '2023-06-12T19:15:00Z'
      },
      { 
        id: '3', 
        title: '京都三日游记', 
        content: '原始内容...', 
        polishedContent: '润色后的内容...',
        category: '旅行', 
        createdAt: '2023-06-08T20:15:00Z',
        updatedAt: '2023-06-09T09:30:00Z'
      }
    ]
  };
};

/**
 * 模拟生成文章总结API
 * @param request 总结请求参数
 * @returns 总结文本
 */
export const generateSummary = async (request: SummaryRequest): Promise<ApiResponse<SummaryResponse>> => {
  // 模拟网络请求延迟
  await delay(3000);
  
  // 模拟总结结果
  let summaryText = '';
  if (request.style === 'chronological') {
    summaryText = '编年体总结：按时间顺序整理的重要事件和经历...';
  } else {
    summaryText = '纪传体总结：围绕特定主题或人物的核心经历和感悟...';
  }
  
  return {
    success: true,
    data: {
      summaryText
    }
  };
};

// 导出API配置
export { API_CONFIG };

// 默认导出
export default {
  transcribeAudio,
  polishText,
  getCategories,
  getArticles,
  generateSummary,
  API_CONFIG
};