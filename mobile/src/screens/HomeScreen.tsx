import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>InkSoul 智能日记</Text>
        <Text style={styles.subtitle}>您的个人AI写作助手</Text>
      </View>

      <View style={styles.featureSection}>
        <Text style={styles.sectionTitle}>核心功能</Text>
        
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('VoiceRecord')}
        >
          <Text style={styles.cardTitle}>🎤 语音记录</Text>
          <Text style={styles.cardDescription}>通过语音对话记录日常生活</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('Diary')}
        >
          <Text style={styles.cardTitle}>📝 智能润色</Text>
          <Text style={styles.cardDescription}>AI自动优化您的文笔和表达</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => navigation.navigate('ArticleList')}
        >
          <Text style={styles.cardTitle}>📚 文章整理</Text>
          <Text style={styles.cardDescription}>自动分类整理成不同主题文章</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.featureCard}>
          <Text style={styles.cardTitle}>📜 历史总结</Text>
          <Text style={styles.cardDescription}>从历史文章中生成纪传体风格总结</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>今日记录</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>128</Text>
          <Text style={styles.statLabel}>总文章数</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>86%</Text>
          <Text style={styles.statLabel}>AI润色率</Text>
        </View>
      </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#e0c4ff',
    textAlign: 'center',
    marginTop: 5,
  },
  featureSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4c1d95',
    marginBottom: 15,
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b46c1',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b46c1',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 5,
  },
});

export default HomeScreen;