import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Alert } from 'react-native';
import ArticleCategory from '../components/ArticleCategory';
import ArticleItem from '../components/ArticleItem';
import { getCategories, getArticles, Category, Diary } from '../utils/api';

const ArticleListScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取分类和文章数据
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取分类数据
      const categoriesResponse = await getCategories();
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }

      // 获取文章数据
      const articlesResponse = await getArticles();
      if (articlesResponse.success && articlesResponse.data) {
        setArticles(articlesResponse.data);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
      Alert.alert('加载失败', '无法加载文章数据，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 渲染分类项
  const renderCategoryItem = ({ item }: { item: Category }) => (
    <ArticleCategory
      name={item.name}
      count={item.count}
      onPress={() => console.log('查看分类:', item.name)}
    />
  );

  // 渲染文章项
  const renderArticleItem = ({ item }: { item: Diary }) => (
    <ArticleItem
      title={item.title}
      category={item.category}
      date={new Date(item.createdAt).toLocaleDateString()}
      summary={item.polishedContent.substring(0, 100) + '...'}
      onPress={() => navigation.navigate('ArticleDetail', { article: item })}
    />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>文章整理</Text>
        <Text style={styles.subtitle}>AI自动分类，轻松管理您的日记</Text>
      </View>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>文章分类</Text>
        {loading ? (
          <Text style={styles.loadingText}>加载中...</Text>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        )}
      </View>

      <View style={styles.articlesSection}>
        <Text style={styles.sectionTitle}>最新文章</Text>
        {loading ? (
          <Text style={styles.loadingText}>加载中...</Text>
        ) : (
          <FlatList
            data={articles}
            renderItem={renderArticleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.articlesList}
          />
        )}
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
  categoriesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4c1d95',
    marginBottom: 15,
  },
  categoriesList: {
    paddingVertical: 5,
  },
  articlesSection: {
    padding: 20,
    paddingBottom: 30,
  },
  articlesList: {
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b46c1',
    padding: 20,
  },
});

export default ArticleListScreen;