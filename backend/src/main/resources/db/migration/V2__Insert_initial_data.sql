-- 插入系统预设分类
INSERT INTO categories (user_id, name, description, color, icon, is_system, sort_order, created_at, updated_at) VALUES
(1, '生活', '日常生活记录', '#4CAF50', 'life', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '工作', '工作相关内容', '#2196F3', 'work', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '学习', '学习心得体会', '#FF9800', 'study', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '旅行', '旅行见闻记录', '#9C27B0', 'travel', true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '情感', '情感感悟分享', '#E91E63', 'emotion', true, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '健康', '健康生活记录', '#4CAF50', 'health', true, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '创作', '创意灵感记录', '#673AB7', 'creative', true, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '思考', '深度思考记录', '#607D8B', 'thinking', true, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 注意：这里的user_id=1是占位符，实际使用时需要根据具体的用户ID来设置
-- 在实际应用中，系统分类应该在用户注册时自动创建