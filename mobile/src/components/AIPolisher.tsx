import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { polishText } from '../utils/api';

interface AIPolisherProps {
  originalText: string;
  onPolishComplete: (polishedText: string) => void;
}

const AIPolisher: React.FC<AIPolisherProps> = ({ originalText, onPolishComplete }) => {
  const [isPolishing, setIsPolishing] = useState(false);
  const [polishedText, setPolishedText] = useState('');

  // 执行AI润色
  const performPolish = async () => {
    if (!originalText.trim()) {
      Alert.alert('提示', '请输入需要润色的内容');
      return;
    }

    setIsPolishing(true);
    
    try {
      const response = await polishText(originalText);
      
      if (response.success && response.data) {
        setPolishedText(response.data.polishedText);
        onPolishComplete(response.data.polishedText);
      } else {
        Alert.alert('润色失败', response.message || 'AI润色过程中出现错误');
      }
    } catch (error) {
      console.error('AI润色失败:', error);
      Alert.alert('润色失败', '网络连接错误，请稍后重试');
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.polishButton, isPolishing && styles.disabledButton]}
        onPress={performPolish}
        disabled={isPolishing}
      >
        {isPolishing ? (
          <>
            <ActivityIndicator color="white" />
            <Text style={styles.buttonText}> AI润色中...</Text>
          </>
        ) : (
          <Text style={styles.buttonText}>✨ AI润色</Text>
        )}
      </TouchableOpacity>

      {polishedText ? (
        <View style={styles.resultContainer}>
          <Text style={styles.label}>润色结果:</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{polishedText}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  polishButton: {
    backgroundColor: '#6b46c1',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  resultContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c1d95',
    marginBottom: 8,
  },
  resultBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
});

export default AIPolisher;