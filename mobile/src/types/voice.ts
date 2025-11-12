/**
 * 语音相关类型定义
 */

export interface VoiceRecording {
  id: string;
  uri: string;
  duration: number;
  size: number;
  createdAt: Date;
}

export interface VoiceTranscription {
  id: string;
  text: string;
  confidence: number;
  language: string;
  duration: number;
  createdAt: Date;
}

export interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  currentRecording: VoiceRecording | null;
  recordings: VoiceRecording[];
  transcriptions: VoiceTranscription[];
  loading: boolean;
  error: string | null;
}

export interface RecordingOptions {
  quality: 'low' | 'medium' | 'high';
  format: 'mp3' | 'wav' | 'm4a';
  maxDuration?: number; // 最大录制时长（秒）
  enableNoiseSuppression?: boolean;
}

export interface TranscriptionRequest {
  audioFile: string; // base64 encoded audio
  language?: string;
  model?: string;
}

export interface TranscriptionResponse {
  text: string;
  confidence: number;
  segments?: TranscriptionSegment[];
  language: string;
  duration: number;
}

export interface TranscriptionSegment {
  text: string;
  start: number;
  end: number;
  confidence: number;
}