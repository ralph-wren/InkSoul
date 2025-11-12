/**
 * 语音录制组件
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootState } from '../../store';
import {
  startRecording,
  stopRecording,
  pauseRecording,
  resumeRecording,
  transcribeAudio,
  clearError,
  updateDuration,
} from '../../store/slices/voiceSlice';
import { Button } from '../ui/Button';
import { colors, typography, spacing } from '../../theme';
import { RecordingOptions } from '../../types/voice';

interface VoiceRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  onRecordingComplete?: (audioUri: string) => void;
  maxDuration?: number;
  autoTranscribe?: boolean;
  recordingOptions?: RecordingOptions;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionComplete,
  onRecordingComplete,
  maxDuration = 600, // 10分钟
  autoTranscribe = true,
  recordingOptions,
}) => {
  const dispatch = useDispatch();
  const { isRecording, isPaused, duration, loading, error, currentRecording } = useSelector(
    (state: RootState) => state.voice
  );

  const [displayDuration, setDisplayDuration] = useState(0);
  const animatedValue = useRef(new Animated.Value(1)).current;
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (error) {
      Alert.alert('错误', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isRecording && !isPaused) {
      // 开始计时
      durationInterval.current = setInterval(() => {
        setDisplayDuration(prev => {
          const newDuration = prev + 1;
          dispatch(updateDuration(newDuration));
          
          // 检查是否达到最大时长
          if (newDuration >= maxDuration) {
            handleStopRecording();
          }
          
          return newDuration;
        });
      }, 1000);

      // 开始录音动画
      startRecordingAnimation();
    } else {
      // 停止计时
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
      
      // 停止动画
      stopRecordingAnimation();
    }

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, [isRecording, isPaused, maxDuration, dispatch]);

  useEffect(() => {
    // 录音完成后的处理
    if (currentRecording && onRecordingComplete) {
      onRecordingComplete(currentRecording.uri);
      
      // 自动转换为文字
      if (autoTranscribe) {
        handleTranscribe(currentRecording.uri);
      }
    }
  }, [currentRecording, onRecordingComplete, autoTranscribe]);

  const startRecordingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopRecordingAnimation = () => {
    animatedValue.stopAnimation();
    animatedValue.setValue(1);
  };

  const handleStartRecording = async () => {
    try {
      setDisplayDuration(0);
      await dispatch(startRecording(recordingOptions)).unwrap();
    } catch (error) {
      console.error('开始录音失败:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      await dispatch(stopRecording()).unwrap();
      setDisplayDuration(0);
    } catch (error) {
      console.error('停止录音失败:', error);
    }
  };

  const handlePauseRecording = async () => {
    try {
      if (isPaused) {
        await dispatch(resumeRecording()).unwrap();
      } else {
        await dispatch(pauseRecording()).unwrap();
      }
    } catch (error) {
      console.error('暂停/恢复录音失败:', error);
    }
  };

  const handleTranscribe = async (audioUri: string) => {
    try {
      const result = await dispatch(transcribeAudio({ audioUri })).unwrap();
      if (onTranscriptionComplete && result.transcription.text) {
        onTranscriptionComplete(result.transcription.text);
      }
    } catch (error) {
      console.error('语音转换失败:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingStatus = (): string => {
    if (loading) return '处理中...';
    if (isRecording && isPaused) return '已暂停';
    if (isRecording) return '录音中...';
    return '点击开始录音';
  };

  const getProgressPercentage = (): number => {
    return Math.min((displayDuration / maxDuration) * 100, 100);
  };

  return (
    <View style={styles.container}>
      {/* 录音状态显示 */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{getRecordingStatus()}</Text>
        <Text style={styles.durationText}>{formatDuration(displayDuration)}</Text>
      </View>

      {/* 进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${getProgressPercentage()}%` }
            ]} 
          />
        </View>
        <Text style={styles.maxDurationText}>
          最长 {formatDuration(maxDuration)}
        </Text>
      </View>

      {/* 录音控制按钮 */}
      <View style={styles.controlsContainer}>
        {!isRecording ? (
          <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
            <Button
              title=""
              onPress={handleStartRecording}
              style={[styles.recordButton, styles.startButton]}
              disabled={loading}
            >
              <Icon name="mic" size={32} color={colors.white} />
            </Button>
          </Animated.View>
        ) : (
          <View style={styles.recordingControls}>
            <Button
              title=""
              onPress={handlePauseRecording}
              style={[styles.controlButton, styles.pauseButton]}
              disabled={loading}
            >
              <Icon 
                name={isPaused ? "play" : "pause"} 
                size={24} 
                color={colors.white} 
              />
            </Button>

            <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
              <Button
                title=""
                onPress={handleStopRecording}
                style={[styles.recordButton, styles.stopButton]}
                disabled={loading}
              >
                <Icon name="stop" size={32} color={colors.white} />
              </Button>
            </Animated.View>
          </View>
        )}
      </View>

      {/* 录音提示 */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>
          {isRecording 
            ? '点击停止按钮结束录音' 
            : '长按录音按钮开始记录您的想法'
          }
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    alignItems: 'center',
  },

  statusContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  statusText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  durationText: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },

  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
    marginBottom: spacing.xs,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },

  maxDurationText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },

  controlsContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },

  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  startButton: {
    backgroundColor: colors.primary,
  },

  stopButton: {
    backgroundColor: colors.error,
  },

  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },

  pauseButton: {
    backgroundColor: colors.warning,
  },

  hintContainer: {
    alignItems: 'center',
  },

  hintText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.sm,
  },
});