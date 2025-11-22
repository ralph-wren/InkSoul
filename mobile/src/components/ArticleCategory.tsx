import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ArticleCategoryProps {
  name: string;
  count: number;
  onPress: () => void;
}

const ArticleCategory: React.FC<ArticleCategoryProps> = ({ name, count, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.count}>{count} 篇</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
    minWidth: 80,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b46c1',
  },
  count: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 3,
  },
});

export default ArticleCategory;