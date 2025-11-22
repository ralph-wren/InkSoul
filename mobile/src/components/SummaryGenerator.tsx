import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { generateSummary, SummaryRequest } from '../utils/api';

interface SummaryGeneratorProps {
  categoryId: string;
  categoryName: string;
}

const SummaryGenerator: React.FC<SummaryGeneratorProps> = ({ categoryId, categoryName }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');

  // 生成编年体总结
  const generateChronologicalSummary = async () => {
    await generateSummaryByStyle('chronological');
  };

  // 生成纪传体总结
  const generateBiographicalSummary = async () => {
    await generateSummaryByStyle('biographical');
  };

  // 根据样式生成总结
  const generateSummaryByStyle = async (style: 'chronological' | 'biographical') => {
    setIsGenerating(true);
    setGeneratedSummary('');
    
    try {
      const request: SummaryRequest = {
        categoryId,
        style
      };
      
      const response = await generateSummary(request);
      
      if (response.success && response.data) {
        setGeneratedSummary(response.data.summaryText);
        Alert.alert('生成完成', '总结文章已生成');
      } else {
        Alert.alert('生成失败', response.message || '生成总结时出现错误');
      }
    } catch (error) {
      console.error('生成总结失败:', error);
      Alert.alert('生成失败', '网络连接错误，请稍后重试');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>生成历史总结</Text>
      <Text style={styles.subtitle}>基于"{categoryName}"分类的所有文章</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.summaryButton, isGenerating && styles.disabledButton]}
          onPress={generateChronologicalSummary}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="white" size="small" />
              <Text style={styles.buttonText}> 生成中...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>📜 编年体总结</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.summaryButton, styles.biographicalButton, isGenerating && styles.disabledButton]}
          onPress={generateBiographicalSummary}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="white" size="small" />
              <Text style={styles.buttonText}> 生成中...</Text>
            </>
          ) : (
            <Text style={styles.buttonText}>📖 纪传体总结</Text>
          )}
        </TouchableOpacity>
      </View>
      
      {generatedSummary ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>生成结果</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{generatedSummary}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4c1d95',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  summaryButton: {
    flex: 1,
    backgroundColor: '#6b46c1',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  biographicalButton: {
    backgroundColor: '#4c1d95',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c1d95',
    marginBottom: 8,
  },
  resultBox: {
    backgroundColor: '#f8fafc',
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

export default SummaryGenerator;