#!/bin/bash

# 修复文件监视限制并启动InkSoul开发环境

echo "🔧 修复文件监视限制..."

# 增加文件监视限制
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS系统
  sudo launchctl limit maxfiles 65536 65536
  ulimit -n 65536
  echo "✅ macOS文件监视限制已调整"
else
  # Linux系统
  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  echo "✅ Linux文件监视限制已调整"
fi

echo "🚀 清理缓存..."
cd /Users/huangg/IdeaProjects/InkSoul/mobile

# 清理React Native缓存
npx react-native start --reset-cache &

echo " Metro服务器正在启动..."
echo " 请在浏览器中访问以下地址："
echo "  ➤ 开发工具: http://localhost:8081"
echo "  ➤ 调试界面: http://localhost:8081/debugger-ui"
echo ""
echo " 如果使用移动设备测试，请确保设备与电脑在同一网络中"
echo " 并在设备上输入电脑的IP地址和端口8081"

# 等待几秒钟让服务器启动
sleep 10

# 检查端口是否已监听
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
  echo "✅ Metro服务器已成功启动"
else
  echo "⚠️  Metro服务器可能启动失败，请手动运行:"
  echo "   cd /Users/huangg/IdeaProjects/InkSoul/mobile && npx react-native start"
fi