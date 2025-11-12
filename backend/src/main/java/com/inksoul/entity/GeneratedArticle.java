package com.inksoul.entity;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

/**
 * 生成文章实体类
 * 
 * @author InkSoul Team
 */
@Entity
@Table(name = "generated_articles", indexes = {
    @Index(name = "idx_article_user_id", columnList = "user_id"),
    @Index(name = "idx_article_category", columnList = "category"),
    @Index(name = "idx_article_style", columnList = "style"),
    @Index(name = "idx_article_created_at", columnList = "created_at")
})
public class GeneratedArticle extends BaseEntity {

    @NotNull(message = "用户不能为空")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank(message = "标题不能为空")
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @NotBlank(message = "内容不能为空")
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "style", nullable = false, length = 20)
    private ArticleStyle style;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "summary", length = 500)
    private String summary;

    @Column(name = "word_count")
    private Integer wordCount;

    @Column(name = "reading_time")
    private Integer readingTime; // 预估阅读时间（分钟）

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @Column(name = "view_count")
    private Long viewCount = 0L;

    @Column(name = "share_count")
    private Long shareCount = 0L;

    @Column(name = "generation_prompt", columnDefinition = "TEXT")
    private String generationPrompt; // 生成文章时使用的提示词

    @Column(name = "quality_score")
    private Double qualityScore; // AI评估的文章质量分数

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "article_source_entries",
        joinColumns = @JoinColumn(name = "article_id"),
        inverseJoinColumns = @JoinColumn(name = "entry_id")
    )
    private Set<DiaryEntry> sourceEntries = new HashSet<>();

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ArticleUpdate> updates = new HashSet<>();

    // 文章风格枚举
    public enum ArticleStyle {
        CHRONOLOGICAL("编年体"),
        BIOGRAPHICAL("纪传体"),
        THEMATIC("主题式"),
        NARRATIVE("叙事体");

        private final String description;

        ArticleStyle(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    // Constructors
    public GeneratedArticle() {}

    public GeneratedArticle(User user, String title, String content, ArticleStyle style) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.style = style;
    }

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ArticleStyle getStyle() {
        return style;
    }

    public void setStyle(ArticleStyle style) {
        this.style = style;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
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

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Long getViewCount() {
        return viewCount;
    }

    public void setViewCount(Long viewCount) {
        this.viewCount = viewCount;
    }

    public Long getShareCount() {
        return shareCount;
    }

    public void setShareCount(Long shareCount) {
        this.shareCount = shareCount;
    }

    public String getGenerationPrompt() {
        return generationPrompt;
    }

    public void setGenerationPrompt(String generationPrompt) {
        this.generationPrompt = generationPrompt;
    }

    public Double getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(Double qualityScore) {
        this.qualityScore = qualityScore;
    }

    public Set<DiaryEntry> getSourceEntries() {
        return sourceEntries;
    }

    public void setSourceEntries(Set<DiaryEntry> sourceEntries) {
        this.sourceEntries = sourceEntries;
    }

    public Set<ArticleUpdate> getUpdates() {
        return updates;
    }

    public void setUpdates(Set<ArticleUpdate> updates) {
        this.updates = updates;
    }
}