-- 创建用户表
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
    writing_style VARCHAR(20) DEFAULT 'CASUAL',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- 创建用户偏好设置表
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ai_personality_traits TEXT,
    communication_style VARCHAR(100) DEFAULT '友好',
    interests TEXT,
    learning_history TEXT,
    privacy_level INTEGER DEFAULT 1,
    auto_categorize BOOLEAN DEFAULT true,
    auto_polish BOOLEAN DEFAULT false,
    notification_enabled BOOLEAN DEFAULT true,
    voice_language VARCHAR(10) DEFAULT 'zh-CN',
    theme_preference VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- 创建分类表
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    color VARCHAR(7),
    icon VARCHAR(50),
    entry_count BIGINT DEFAULT 0,
    is_system BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    UNIQUE(user_id, name)
);

-- 创建日记条目表
CREATE TABLE diary_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    original_content TEXT,
    audio_file_url TEXT,
    audio_duration INTEGER,
    category VARCHAR(50),
    tags TEXT,
    mood VARCHAR(20),
    location_name VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    word_count INTEGER,
    reading_time INTEGER,
    ai_analysis TEXT,
    sentiment_score DOUBLE PRECISION,
    sentiment VARCHAR(20),
    is_polished BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- 创建生成文章表
CREATE TABLE generated_articles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    style VARCHAR(20) NOT NULL,
    category VARCHAR(50),
    summary VARCHAR(500),
    word_count INTEGER,
    reading_time INTEGER,
    is_public BOOLEAN DEFAULT false,
    view_count BIGINT DEFAULT 0,
    share_count BIGINT DEFAULT 0,
    generation_prompt TEXT,
    quality_score DOUBLE PRECISION,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- 创建文章更新记录表
CREATE TABLE article_updates (
    id BIGSERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES generated_articles(id) ON DELETE CASCADE,
    update_type VARCHAR(20) NOT NULL,
    previous_content TEXT,
    new_content TEXT,
    added_entries TEXT,
    update_summary VARCHAR(500),
    auto_generated BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0
);

-- 创建文章源条目关联表
CREATE TABLE article_source_entries (
    article_id BIGINT NOT NULL REFERENCES generated_articles(id) ON DELETE CASCADE,
    entry_id BIGINT NOT NULL REFERENCES diary_entries(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, entry_id)
);

-- 创建索引
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_username ON users(username);

CREATE INDEX idx_diary_user_id ON diary_entries(user_id);
CREATE INDEX idx_diary_category ON diary_entries(category);
CREATE INDEX idx_diary_created_at ON diary_entries(created_at);

CREATE INDEX idx_article_user_id ON generated_articles(user_id);
CREATE INDEX idx_article_category ON generated_articles(category);
CREATE INDEX idx_article_style ON generated_articles(style);
CREATE INDEX idx_article_created_at ON generated_articles(created_at);

CREATE INDEX idx_update_article_id ON article_updates(article_id);
CREATE INDEX idx_update_created_at ON article_updates(created_at);

CREATE INDEX idx_category_user_id ON categories(user_id);
CREATE INDEX idx_category_name ON categories(name);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表创建更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_diary_entries_updated_at BEFORE UPDATE ON diary_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_articles_updated_at BEFORE UPDATE ON generated_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_article_updates_updated_at BEFORE UPDATE ON article_updates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();