# 笔心 · InkSoul

一款智能个人日记应用，通过语音对话记录用户的日常生活，并运用AI技术对内容进行智能整理、分类和润色。

## 项目特色

- 🎤 **语音记录** - 支持语音转文字，随时随地记录生活
- ✨ **智能润色** - AI自动优化文笔，让表达更加优美
- 🏷️ **智能分类** - 自动识别内容主题，智能归类整理
- 📖 **文章生成** - 将零散记录整合成完整文章，支持纪传体和编年体风格
- 🔍 **智能搜索** - 根据人物、事件快速检索相关内容
- 🤖 **个性化AI** - 学习用户习惯，提供个性化对话体验
- 📱 **跨平台** - React Native开发，支持iOS和Android
- ☁️ **云端部署** - Kubernetes容器化部署，高可用架构

## 技术架构

### 后端技术栈
- Java 8 + Spring Boot 2.7
- Spring Security + JWT认证
- PostgreSQL + Redis
- Elasticsearch全文搜索
- Docker + Kubernetes部署

### 移动端技术栈
- React Native 0.72
- TypeScript
- Redux Toolkit状态管理
- React Navigation导航

### AI服务集成
- OpenAI GPT-4文本处理
- Azure Speech Services语音识别
- 自定义AI模型支持

## 快速开始

### 环境要求
- Java 8+
- Node.js 18+
- PostgreSQL 13+
- Redis 7+
- Docker & Kubernetes (可选)

### 后端启动

```bash
cd backend
./mvnw spring-boot:run
```

### 移动端启动

```bash
cd mobile
npm install
npm run android  # 或 npm run ios
```

### Docker部署

```bash
# 构建镜像
docker build -t ink-soul/api ./backend

# 启动服务
docker-compose up -d
```

### Kubernetes部署

```bash
# 创建命名空间和配置
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# 部署应用
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

## 项目结构

```
ink-soul/
├── backend/                 # Spring Boot后端
│   ├── src/main/java/      # Java源代码
│   ├── src/main/resources/ # 配置文件
│   └── Dockerfile          # Docker构建文件
├── mobile/                 # React Native移动端
│   ├── src/                # TypeScript源代码
│   ├── android/            # Android原生代码
│   └── ios/                # iOS原生代码
├── k8s/                    # Kubernetes配置
├── .github/workflows/      # CI/CD流水线
└── docs/                   # 项目文档
```

## 开发指南

### 代码规范
- 后端遵循阿里巴巴Java开发手册
- 移动端使用ESLint + Prettier
- 提交信息遵循Conventional Commits规范

### 测试策略
- 单元测试覆盖率 > 90%
- 集成测试覆盖核心业务流程
- E2E测试验证用户关键路径

### API文档
启动后端服务后访问: http://localhost:8080/api/swagger-ui.html

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系我们

- 项目主页: https://github.com/ink-soul/ink-soul-app
- 问题反馈: https://github.com/ink-soul/ink-soul-app/issues
- 邮箱: contact@inksoul.app

---

**笔心 · InkSoul** - 让每一个想法都有迹可循 ✨