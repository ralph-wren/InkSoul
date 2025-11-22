import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import Sound from 'react-native-sound';

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const soundRef = useRef<Sound | null>(null);

  // 音频录制配置
  const audioOptions = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: 'recording.wav'
  };

  // 请求录音权限
  const requestRecordPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '录音权限',
            message: 'InkSoul需要访问您的麦克风来录制语音日记',
            buttonNeutral: '稍后询问',
            buttonNegative: '取消',
            buttonPositive: '确定',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS默认有权限
  };

  // 开始录音
  const startRecording = async () => {
    const hasPermission = await requestRecordPermission();
    if (!hasPermission) {
      Alert.alert('权限不足', '需要麦克风权限才能录音');
      return;
    }

    try {
      AudioRecord.init(audioOptions);
      AudioRecord.start();
      setIsRecording(true);
      setAudioFile(null);
    } catch (error) {
      console.error('录音启动失败:', error);
      Alert.alert('录音失败', '无法启动录音功能');
    }
  };

  // 停止录音
  const stopRecording = async () => {
    try {
      const filePath = await AudioRecord.stop();
      setIsRecording(false);
      setAudioFile(filePath);
      
      // 模拟语音转文字过程
      setTimeout(() => {
        const transcribedText = '今天天气真好，我和朋友一起去公园散步。我们聊了很多有趣的话题，感觉非常愉快。这样的日子让人感到生活很美好。';
        onTranscriptionComplete(transcribedText);
      }, 1500);
    } catch (error) {
      console.error('录音停止失败:', error);
      Alert.alert('录音失败', '无法停止录音功能');
    }
  };

  // 播放录音
  const playRecording = () => {
    if (isRecording || !audioFile) return;
    
    if (isPlaying) {
      // 如果正在播放，则停止
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current?.release();
          soundRef.current = null;
          setIsPlaying(false);
        });
      }
    } else {
      // 开始播放
      soundRef.current = new Sound(audioFile, '', (error) => {
        if (error) {
          console.error('播放失败:', error);
          Alert.alert('播放失败', '无法播放录音文件');
          return;
        }
        
        setIsPlaying(true);
        soundRef.current?.play((success) => {
          if (success) {
            console.log('播放完成');
          } else {
            console.log('播放失败');
          }
          setIsPlaying(false);
          soundRef.current?.release();
          soundRef.current = null;
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.recordButton, isRecording && styles.recording]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.buttonText}>
            {isRecording ? '⏹️ 停止' : '⏺️ 录音'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.playButton, (!audioFile || isRecording) && styles.disabled]}
          onPress={playRecording}
          disabled={!audioFile || isRecording}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.status}>
        {isRecording && (
          <Text style={styles.recordingStatus}>正在录音...</Text>
        )}
        {audioFile && !isRecording && (
          <Text style={styles.readyStatus}>录音完成，等待转录</Text>
        )}
        {!audioFile && !isRecording && (
          <Text style={styles.idleStatus}>点击按钮开始录音</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  recordButton: {
    backgroundColor: '#6b46c1',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: '#e53e3e',
    transform: [{ scale: 1.1 }],
  },
  playButton: {
    backgroundColor: '#4c1d95',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  status: {
    alignItems: 'center',
    marginTop: 15,
  },
  recordingStatus: {
    color: '#e53e3e',
    fontWeight: 'bold',
  },
  readyStatus: {
    color: '#6b46c1',
    fontWeight: 'bold',
  },
  idleStatus: {
    color: '#94a3b8',
  },
});

export default VoiceRecorder;