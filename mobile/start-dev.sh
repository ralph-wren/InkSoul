#!/bin/bash

# InkSoul 移动端开发启动脚本
# 用于本地调试和开发

echo "🚀 启动 InkSoul 移动端开发环境..."

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
  echo "📦 安装项目依赖..."
  npm install
fi

# 启动 Metro 服务器
echo "🚇 启动 Metro 服务器..."
npx react-native start &

# 等待 Metro 服务器启动
sleep 5

# 启动 iOS 模拟器（如果在 macOS 上）
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "📱 启动 iOS 模拟器..."
  npx react-native run-ios
else
  # 启动 Android 模拟器
  echo "🤖 启动 Android 模拟器..."
  npx react-native run-android
fi

echo "✅ 开发环境已启动！"
echo "应用查看地址: http://localhost:8081"
echo "调试地址: http://localhost:8081/debugger-ui"