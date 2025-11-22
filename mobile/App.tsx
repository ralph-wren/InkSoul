/**
 * InkSoul 智能日记应用
 * 主应用入口文件
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import DiaryScreen from './src/screens/DiaryScreen';
import VoiceRecordScreen from './src/screens/VoiceRecordScreen';
import ArticleListScreen from './src/screens/ArticleListScreen';
import ArticleDetailScreen from './src/screens/ArticleDetailScreen';

// 创建导航堆栈
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6b46c1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'InkSoul 智能日记' }} 
        />
        <Stack.Screen 
          name="Diary" 
          component={DiaryScreen} 
          options={{ title: '我的日记' }} 
        />
        <Stack.Screen 
          name="VoiceRecord" 
          component={VoiceRecordScreen} 
          options={{ title: '语音记录' }} 
        />
        <Stack.Screen 
          name="ArticleList" 
          component={ArticleListScreen} 
          options={{ title: '文章列表' }} 
        />
        <Stack.Screen 
          name="ArticleDetail" 
          component={ArticleDetailScreen} 
          options={{ title: '文章详情' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;