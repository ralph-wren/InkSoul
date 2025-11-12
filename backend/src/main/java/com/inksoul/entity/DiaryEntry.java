package com.inksoul.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

/**
 * 日记条目实体类
 * 
 * @author InkSoul Team
 */
@Entity
@Table(name = "diary_entries", indexes = {
    @Index(name = "idx_diary_user_id", columnList = "user_id"),
    @Index(name = "idx_diary_category", columnList = "category"),
    @Index(name = "idx_diary_created_at", columnList = "created_at")
})
public class DiaryEntry extends BaseEntity {

    @NotNull(message = "用户不能为空")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "内容不能为空")
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "original_content", columnDefinition = "TEXT")
    private String originalContent; // 润色前的原始内容

    @Column(name = "audio_file_url")
    private String audioFileUrl;

    @Column(name = "audio_duration")
    private Integer audioDuration; // 音频时长（秒）

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags; // JSON格式存储标签数组

    @Enumerated(EnumType.STRING)
    @Column(name = "mood", length = 20)
    private Mood mood;

    @Column(name = "location_name", length = 100)
    private String locationName;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "word_count")
    private Integer wordCount;

    @Column(name = "reading_time")
    private Integer readingTime; // 预估阅读时间（分钟）

    @Column(name = "ai_analysis", columnDefinition = "TEXT")
    private String aiAnalysis; // JSON格式存储AI分析结果

    @Column(name = "sentiment_score")
    private Double sentimentScore; // 情感分数 -1.0 到 1.0

    @Enumerated(EnumType.STRING)
    @Column(name = "sentiment", length = 20)
    private Sentiment sentiment;

    @Column(name = "is_polished")
    private Boolean isPolished = false;

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @ManyToMany(mappedBy = "sourceEntries", fetch = FetchType.LAZY)
    private Set<GeneratedArticle> relatedArticles = new HashSet<>();

    // 心情枚举
    public enum Mood {
        HAPPY("开心"),
        SAD("难过"),
        EXCITED("兴奋"),
        CALM("平静"),
        ANXIOUS("焦虑"),
        GRATEFUL("感激"),
        NOSTALGIC("怀念"),
        HOPEFUL("充满希望");

        private final String description;

        Mood(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // 情感枚举
    public enum Sentiment {
        POSITIVE("积极"),
        NEGATIVE("消极"),
        NEUTRAL("中性");

        private final String description;

        Sentiment(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // Constructors
    public DiaryEntry() {}

    public DiaryEntry(User user, String content) {
        this.user = user;
        this.content = content;
    }

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getOriginalContent() {
        return originalContent;
    }

    public void setOriginalContent(String originalContent) {
        this.originalContent = originalContent;
    }

    public String getAudioFileUrl() {
        return audioFileUrl;
    }

    public void setAudioFileUrl(String audioFileUrl) {
        this.audioFileUrl = audioFileUrl;
    }

    public Integer getAudioDuration() {
        return audioDuration;
    }

    public void setAudioDuration(Integer audioDuration) {
        this.audioDuration = audioDuration;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Mood getMood() {
        return mood;
    }

    public void setMood(Mood mood) {
        this.mood = mood;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getWordCount() {
        return wordCount;
    }

    public void setWordCount(Integer wordCount) {
        this.wordCount = wordCount;
    }

    public Integer getReadingTime() {
        return readingTime;
    }

    public void setReadingTime(Integer readingTime) {
        this.readingTime = readingTime;
    }

    public String getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(String aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    public Double getSentimentScore() {
        return sentimentScore;
    }

    public void setSentimentScore(Double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }

    public Sentiment getSentiment() {
        return sentiment;
    }

    public void setSentiment(Sentiment sentiment) {
        this.sentiment = sentiment;
    }

    public Boolean getIsPolished() {
        return isPolished;
    }

    public void setIsPolished(Boolean isPolished) {
        this.isPolished = isPolished;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Set<GeneratedArticle> getRelatedArticles() {
        return relatedArticles;
    }

    public void setRelatedArticles(Set<GeneratedArticle> relatedArticles) {
        this.relatedArticles = relatedArticles;
    }
}