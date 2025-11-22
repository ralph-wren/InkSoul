import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ArticleItemProps {
  title: string;
  category: string;
  date: string;
  summary: string;
  onPress: () => void;
}

const ArticleItem: React.FC<ArticleItemProps> = ({ title, category, date, summary, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{category}</Text>
        </View>
      </View>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.summary} numberOfLines={3}>{summary}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 10,
  },
  tag: {
    backgroundColor: '#ede9fe',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontSize: 12,
    color: '#6b46c1',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default ArticleItem;