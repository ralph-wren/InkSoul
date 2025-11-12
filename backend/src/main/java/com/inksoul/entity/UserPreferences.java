package com.inksoul.entity;

import javax.persistence.*;

/**
 * 用户偏好设置实体类
 * 
 * @author InkSoul Team
 */
@Entity
@Table(name = "user_preferences")
public class UserPreferences extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "ai_personality_traits", columnDefinition = "TEXT")
    private String aiPersonalityTraits; // JSON格式存储AI个性特征

    @Column(name = "communication_style", length = 100)
    private String communicationStyle = "友好";

    @Column(name = "interests", columnDefinition = "TEXT")
    private String interests; // JSON格式存储兴趣爱好

    @Column(name = "learning_history", columnDefinition = "TEXT")
    private String learningHistory; // JSON格式存储学习历史

    @Column(name = "privacy_level")
    private Integer privacyLevel = 1; // 1-公开, 2-朋友可见, 3-私密

    @Column(name = "auto_categorize")
    private Boolean autoCategorize = true;

    @Column(name = "auto_polish")
    private Boolean autoPolish = false;

    @Column(name = "notification_enabled")
    private Boolean notificationEnabled = true;

    @Column(name = "voice_language", length = 10)
    private String voiceLanguage = "zh-CN";

    @Column(name = "theme_preference", length = 20)
    private String themePreference = "light";

    // Constructors
    public UserPreferences() {}

    public UserPreferences(User user) {
        this.user = user;
    }

    // Getters and Setters
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAiPersonalityTraits() {
        return aiPersonalityTraits;
    }

    public void setAiPersonalityTraits(String aiPersonalityTraits) {
        this.aiPersonalityTraits = aiPersonalityTraits;
    }

    public String getCommunicationStyle() {
        return communicationStyle;
    }

    public void setCommunicationStyle(String communicationStyle) {
        this.communicationStyle = communicationStyle;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getLearningHistory() {
        return learningHistory;
    }

    public void setLearningHistory(String learningHistory) {
        this.learningHistory = learningHistory;
    }

    public Integer getPrivacyLevel() {
        return privacyLevel;
    }

    public void setPrivacyLevel(Integer privacyLevel) {
        this.privacyLevel = privacyLevel;
    }

    public Boolean getAutoCategorize() {
        return autoCategorize;
    }

    public void setAutoCategorize(Boolean autoCategorize) {
        this.autoCategorize = autoCategorize;
    }

    public Boolean getAutoPolish() {
        return autoPolish;
    }

    public void setAutoPolish(Boolean autoPolish) {
        this.autoPolish = autoPolish;
    }

    public Boolean getNotificationEnabled() {
        return notificationEnabled;
    }

    public void setNotificationEnabled(Boolean notificationEnabled) {
        this.notificationEnabled = notificationEnabled;
    }

    public String getVoiceLanguage() {
        return voiceLanguage;
    }

    public void setVoiceLanguage(String voiceLanguage) {
        this.voiceLanguage = voiceLanguage;
    }

    public String getThemePreference() {
        return themePreference;
    }

    public void setThemePreference(String themePreference) {
        this.themePreference = themePreference;
    }
}