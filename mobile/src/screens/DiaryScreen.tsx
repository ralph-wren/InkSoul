import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AIPolisher from '../components/AIPolisher';

const DiaryScreen = () => {
  const [diaryTitle, setDiaryTitle] = useState('');
  const [diaryContent, setDiaryContent] = useState('');
  const [polishedContent, setPolishedContent] = useState('');

  // 处理润色完成事件
  const handlePolishComplete = (polishedText: string) => {
    setPolishedContent(polishedText);
    Alert.alert('润色完成', 'AI已优化您的文笔');
  };

  // 保存日记
  const saveDiary = () => {
    if (!diaryTitle.trim() || !polishedContent.trim()) {
      Alert.alert('提示', '请填写标题并润色内容后再保存');
      return;
    }

    // 模拟保存操作
    console.log('保存日记:', { title: diaryTitle, content: polishedContent });
    Alert.alert('保存成功', '日记已保存到您的个人档案中');
    setDiaryTitle('');
    setDiaryContent('');
    setPolishedContent('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的日记</Text>
        <Text style={styles.subtitle}>记录生活点滴，AI助您润色文笔</Text>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.label}>日记标题</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="请输入日记标题"
          value={diaryTitle}
          onChangeText={setDiaryTitle}
        />

        <Text style={styles.label}>日记内容</Text>
        <TextInput
          style={styles.contentInput}
          placeholder="请输入您的日记内容..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={diaryContent}
          onChangeText={setDiaryContent}
        />
      </View>

      <View style={styles.polishSection}>
        <AIPolisher 
          originalText={diaryContent} 
          onPolishComplete={handlePolishComplete} 
        />
      </View>

      <View style={styles.resultSection}>
        <Text style={styles.label}>润色结果</Text>
        {polishedContent ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{polishedContent}</Text>
          </View>
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>
              AI润色结果将显示在这里
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
  inputSection: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c1d95',
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  contentInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    height: 150,
  },
  polishSection: {
    padding: 20,
  },
  resultSection: {
    padding: 20,
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
  placeholderBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  placeholderText: {
    fontSize: 16,
    color: '#94a3b8',
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

export default DiaryScreen;