/**
 * 语音录制和转换服务
 */

import { Platform, PermissionsAndroid, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { ApiService } from './api';
import {
  VoiceRecording,
  RecordingOptions,
  TranscriptionRequest,
  TranscriptionResponse,
  ApiResponse,
} from '../types';

export class VoiceService {
  private static audioRecorderPlayer = new AudioRecorderPlayer();
  private static currentRecordingPath: string | null = null;

  /**
   * 请求录音权限
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '录音权限',
            message: '笔心需要录音权限来记录您的语音日记',
            buttonNeutral: '稍后询问',
            buttonNegative: '拒绝',
            buttonPositive: '允许',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS权限在Info.plist中配置
    } catch (error) {
      console.error('请求录音权限失败:', error);
      return false;
    }
  }

  /**
   * 开始录音
   */
  static async startRecording(options: RecordingOptions = {
    quality: 'medium',
    format: 'm4a',
    maxDuration: 600, // 10分钟
    enableNoiseSuppression: true,
  }): Promise<string> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('没有录音权限');
      }

      // 生成录音文件路径
      const timestamp = Date.now();
      const fileName = `recording_${timestamp}.${options.format}`;
      const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // 配置录音参数
      const audioSet = {
        AudioEncoderAndroid: 'aac',
        AudioSourceAndroid: 'mic',
        AVEncoderAudioQualityKeyIOS: 'high',
        AVNumberOfChannelsKeyIOS: 1,
        AVFormatIDKeyIOS: 'mp4',
      };

      // 开始录音
      const result = await this.audioRecorderPlayer.startRecorder(path, audioSet);
      this.currentRecordingPath = result;

      // 设置最大录制时长
      if (options.maxDuration) {
        setTimeout(() => {
          this.stopRecording().catch(console.error);
        }, options.maxDuration * 1000);
      }

      return result;
    } catch (error) {
      console.error('开始录音失败:', error);
      throw error;
    }
  }

  /**
   * 停止录音
   */
  static async stopRecording(): Promise<VoiceRecording> {
    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      
      if (!this.currentRecordingPath) {
        throw new Error('没有正在进行的录音');
      }

      // 获取文件信息
      const fileInfo = await RNFS.stat(this.currentRecordingPath);
      
      const recording: VoiceRecording = {
        id: Date.now().toString(),
        uri: this.currentRecordingPath,
        duration: 0, // 需要从录音结果中获取
        size: fileInfo.size,
        createdAt: new Date(),
      };

      this.currentRecordingPath = null;
      return recording;
    } catch (error) {
      console.error('停止录音失败:', error);
      throw error;
    }
  }

  /**
   * 暂停录音
   */
  static async pauseRecording(): Promise<void> {
    try {
      await this.audioRecorderPlayer.pauseRecorder();
    } catch (error) {
      console.error('暂停录音失败:', error);
      throw error;
    }
  }

  /**
   * 恢复录音
   */
  static async resumeRecording(): Promise<void> {
    try {
      await this.audioRecorderPlayer.resumeRecorder();
    } catch (error) {
      console.error('恢复录音失败:', error);
      throw error;
    }
  }

  /**
   * 播放录音
   */
  static async playRecording(uri: string): Promise<void> {
    try {
      await this.audioRecorderPlayer.startPlayer(uri);
    } catch (error) {
      console.error('播放录音失败:', error);
      throw error;
    }
  }

  /**
   * 停止播放
   */
  static async stopPlaying(): Promise<void> {
    try {
      await this.audioRecorderPlayer.stopPlayer();
    } catch (error) {
      console.error('停止播放失败:', error);
      throw error;
    }
  }

  /**
   * 删除录音文件
   */
  static async deleteRecording(uri: string): Promise<void> {
    try {
      const exists = await RNFS.exists(uri);
      if (exists) {
        await RNFS.unlink(uri);
      }
    } catch (error) {
      console.error('删除录音文件失败:', error);
      throw error;
    }
  }

  /**
   * 将音频文件转换为Base64
   */
  static async audioToBase64(uri: string): Promise<string> {
    try {
      const base64 = await RNFS.readFile(uri, 'base64');
      return base64;
    } catch (error) {
      console.error('音频转Base64失败:', error);
      throw error;
    }
  }

  /**
   * 语音转文字
   */
  static async transcribeAudio(
    audioUri: string,
    language: string = 'zh-CN'
  ): Promise<TranscriptionResponse> {
    try {
      // 将音频文件转换为Base64
      const audioBase64 = await this.audioToBase64(audioUri);
      
      const request: TranscriptionRequest = {
        audioFile: audioBase64,
        language,
        model: 'whisper-1',
      };

      const response = await ApiService.post<ApiResponse<TranscriptionResponse>>(
        '/voice/transcribe',
        request
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || '语音转换失败');
    } catch (error) {
      console.error('语音转文字失败:', error);
      throw error;
    }
  }

  /**
   * 获取录音时长
   */
  static async getRecordingDuration(uri: string): Promise<number> {
    try {
      // 这里需要使用音频库来获取时长
      // 暂时返回0，实际实现需要音频分析库
      return 0;
    } catch (error) {
      console.error('获取录音时长失败:', error);
      return 0;
    }
  }

  /**
   * 设置录音监听器
   */
  static setRecordingListener(
    onProgress?: (data: { currentPosition: number }) => void,
    onFinished?: (data: { audioFileURL: string }) => void
  ): void {
    if (onProgress) {
      this.audioRecorderPlayer.addRecordBackListener(onProgress);
    }
    
    if (onFinished) {
      // 录音完成监听器
      // 注意：react-native-audio-recorder-player可能没有直接的完成监听器
      // 需要根据实际库的API进行调整
    }
  }

  /**
   * 移除录音监听器
   */
  static removeRecordingListener(): void {
    this.audioRecorderPlayer.removeRecordBackListener();
  }

  /**
   * 检查录音状态
   */
  static isRecording(): boolean {
    return this.currentRecordingPath !== null;
  }
}