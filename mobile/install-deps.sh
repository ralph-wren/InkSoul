#!/bin/bash

# 安装React Native项目所需的所有依赖

echo "Installing React Native dependencies..."

# 安装项目依赖
npm install

# 安装类型定义
npm install --save-dev @types/react @types/react-native

# 安装导航依赖
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# 安装音频处理依赖
npm install react-native-audio-record react-native-sound

# 安装iOS平台特定依赖
cd ios && pod install && cd ..

echo "All dependencies installed successfully!"