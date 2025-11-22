import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import VoiceRecorder from '../components/VoiceRecorder';

const VoiceRecordScreen = () => {
  const [transcribedText, setTranscribedText] = useState('');

  // 处理转录完成事件
  const handleTranscriptionComplete = (text: string) => {
    setTranscribedText(text);
    Alert.alert('转录完成', '语音已成功转换为文字');
  };

  // 保存日记
  const saveDiary = () => {
    if (!transcribedText) {
      Alert.alert('无法保存', '请先录音并转录文字');
      return;
    }
    
    // 模拟保存到服务器
    console.log('保存日记:', transcribedText);
    Alert.alert('保存成功', '日记已保存并提交AI润色');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>语音记录</Text>
        <Text style={styles.subtitle}>点击按钮开始录音，AI将自动转录为文字</Text>
      </View>

      <View style={styles.recorderContainer}>
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      </View>

      <View style={styles.transcriptSection}>
        <Text style={styles.sectionTitle}>语音转文字</Text>
        {transcribedText ? (
          <View style={styles.transcriptBox}>
            <Text style={styles.transcriptText}>{transcribedText}</Text>
          </View>
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>
              录音结束后将显示转录文字
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={saveDiary}
      >
        <Text style={styles.saveButtonText}>💾 保存日记</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3ff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#6b46c1',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0c4ff',
    textAlign: 'center',
    marginTop: 5,
  },
  recorderContainer: {
    padding: 20,
  },
  transcriptSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4c1d95',
    marginBottom: 10,
  },
  transcriptBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  transcriptText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  placeholderBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  placeholderText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#6b46c1',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default VoiceRecordScreen;