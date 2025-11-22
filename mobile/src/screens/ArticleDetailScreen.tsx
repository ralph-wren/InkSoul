import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import SummaryGenerator from '../components/SummaryGenerator';

const ArticleDetailScreen = ({ route }: any) => {
  const { article } = route.params || {};

  if (!article) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>未找到文章内容</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{article.title}</Text>
        <View style={styles.metaInfo}>
          <Text style={styles.category}>{article.category}</Text>
          <Text style={styles.date}>{new Date(article.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.content}>{article.summary}</Text>
        
        <View style={styles.fullContent}>
          <Text style={styles.contentParagraph}>
            这是文章的完整内容。在实际应用中，这里会显示您记录的完整日记内容。
            AI已经对内容进行了润色和优化，使其更加流畅和优美。
          </Text>
          
          <Text style={styles.contentParagraph}>
            我们通过先进的自然语言处理技术，能够自动识别日记中的关键信息，
            并将其分类整理到相应的主题下。这样您就可以轻松地回顾和管理自己的日记内容。
          </Text>
          
          <Text style={styles.contentParagraph}>
            此外，系统还支持从历史文章中提取关键信息，生成纪传体或编年体风格的总结文章，
            帮助您更好地回顾和理解自己的成长历程。
          </Text>
        </View>
      </View>

      <SummaryGenerator 
        categoryId="1" 
        categoryName={article.category} 
      />
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
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  category: {
    backgroundColor: '#ede9fe',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#6b46c1',
    fontWeight: 'bold',
  },
  date: {
    color: '#e0c4ff',
    fontSize: 14,
  },
  contentSection: {
    padding: 20,
  },
  content: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    marginBottom: 20,
  },
  fullContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  contentParagraph: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    marginBottom: 15,
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: '#6b46c1',
  },
});

export default ArticleDetailScreen;