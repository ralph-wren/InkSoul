/**
 * 语音录制状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { VoiceService } from '../../services/voiceService';
import {
  VoiceRecordingState,
  VoiceRecording,
  VoiceTranscription,
  RecordingOptions,
  TranscriptionResponse,
} from '../../types/voice';

// 初始状态
const initialState: VoiceRecordingState = {
  isRecording: false,
  isPaused: false,
  duration: 0,
  currentRecording: null,
  recordings: [],
  transcriptions: [],
  loading: false,
  error: null,
};

// 异步操作
export const startRecording = createAsyncThunk(
  'voice/startRecording',
  async (options?: RecordingOptions, { rejectWithValue }) => {
    try {
      const path = await VoiceService.startRecording(options);
      return path;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const stopRecording = createAsyncThunk(
  'voice/stopRecording',
  async (_, { rejectWithValue }) => {
    try {
      const recording = await VoiceService.stopRecording();
      return recording;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const pauseRecording = createAsyncThunk(
  'voice/pauseRecording',
  async (_, { rejectWithValue }) => {
    try {
      await VoiceService.pauseRecording();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resumeRecording = createAsyncThunk(
  'voice/resumeRecording',
  async (_, { rejectWithValue }) => {
    try {
      await VoiceService.resumeRecording();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const transcribeAudio = createAsyncThunk(
  'voice/transcribeAudio',
  async (
    { audioUri, language }: { audioUri: string; language?: string },
    { rejectWithValue }
  ) => {
    try {
      const result = await VoiceService.transcribeAudio(audioUri, language);
      return { audioUri, transcription: result };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRecording = createAsyncThunk(
  'voice/deleteRecording',
  async (recordingId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { voice: VoiceRecordingState };
      const recording = state.voice.recordings.find(r => r.id === recordingId);
      
      if (recording) {
        await VoiceService.deleteRecording(recording.uri);
      }
      
      return recordingId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// 语音录制切片
const voiceSlice = createSlice({
  name: 'voice',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    updateDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    
    addRecording: (state, action: PayloadAction<VoiceRecording>) => {
      state.recordings.unshift(action.payload);
    },
    
    removeRecording: (state, action: PayloadAction<string>) => {
      state.recordings = state.recordings.filter(r => r.id !== action.payload);
      state.transcriptions = state.transcriptions.filter(t => t.id !== action.payload);
    },
    
    addTranscription: (state, action: PayloadAction<VoiceTranscription>) => {
      const existingIndex = state.transcriptions.findIndex(t => t.id === action.payload.id);
      if (existingIndex >= 0) {
        state.transcriptions[existingIndex] = action.payload;
      } else {
        state.transcriptions.push(action.payload);
      }
    },
    
    resetRecording: (state) => {
      state.isRecording = false;
      state.isPaused = false;
      state.duration = 0;
      state.currentRecording = null;
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // 开始录音
    builder
      .addCase(startRecording.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startRecording.fulfilled, (state, action) => {
        state.loading = false;
        state.isRecording = true;
        state.isPaused = false;
        state.duration = 0;
        state.error = null;
      })
      .addCase(startRecording.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 停止录音
    builder
      .addCase(stopRecording.pending, (state) => {
        state.loading = true;
      })
      .addCase(stopRecording.fulfilled, (state, action) => {
        state.loading = false;
        state.isRecording = false;
        state.isPaused = false;
        state.currentRecording = action.payload;
        state.recordings.unshift(action.payload);
        state.error = null;
      })
      .addCase(stopRecording.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 暂停录音
    builder
      .addCase(pauseRecording.pending, (state) => {
        state.loading = true;
      })
      .addCase(pauseRecording.fulfilled, (state) => {
        state.loading = false;
        state.isPaused = true;
        state.error = null;
      })
      .addCase(pauseRecording.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 恢复录音
    builder
      .addCase(resumeRecording.pending, (state) => {
        state.loading = true;
      })
      .addCase(resumeRecording.fulfilled, (state) => {
        state.loading = false;
        state.isPaused = false;
        state.error = null;
      })
      .addCase(resumeRecording.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 语音转文字
    builder
      .addCase(transcribeAudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transcribeAudio.fulfilled, (state, action) => {
        state.loading = false;
        const { audioUri, transcription } = action.payload;
        
        // 找到对应的录音
        const recording = state.recordings.find(r => r.uri === audioUri);
        if (recording) {
          const voiceTranscription: VoiceTranscription = {
            id: recording.id,
            text: transcription.text,
            confidence: transcription.confidence,
            language: transcription.language,
            duration: transcription.duration,
            createdAt: new Date(),
          };
          
          const existingIndex = state.transcriptions.findIndex(t => t.id === recording.id);
          if (existingIndex >= 0) {
            state.transcriptions[existingIndex] = voiceTranscription;
          } else {
            state.transcriptions.push(voiceTranscription);
          }
        }
        
        state.error = null;
      })
      .addCase(transcribeAudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 删除录音
    builder
      .addCase(deleteRecording.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRecording.fulfilled, (state, action) => {
        state.loading = false;
        const recordingId = action.payload;
        state.recordings = state.recordings.filter(r => r.id !== recordingId);
        state.transcriptions = state.transcriptions.filter(t => t.id !== recordingId);
        state.error = null;
      })
      .addCase(deleteRecording.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  updateDuration,
  addRecording,
  removeRecording,
  addTranscription,
  resetRecording,
} = voiceSlice.actions;

export default voiceSlice.reducer;