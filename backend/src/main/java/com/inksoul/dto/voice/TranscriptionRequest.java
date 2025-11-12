package com.inksoul.dto.voice;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 语音转文字请求DTO
 * 
 * @author InkSoul Team
 */
public class TranscriptionRequest {
    
    @NotBlank(message = "音频文件不能为空")
    private String audioFile; // Base64编码的音频文件
    
    @Size(max = 10, message = "语言代码长度不能超过10个字符")
    private String language = "zh-CN";
    
    @Size(max = 50, message = "模型名称长度不能超过50个字符")
    private String model = "whisper-1";
    
    private Boolean enableTimestamps = false;
    
    private Boolean enableWordTimestamps = false;
    
    private Double temperature = 0.0;
    
    // Constructors
    public TranscriptionRequest() {}
    
    public TranscriptionRequest(String audioFile, String language) {
        this.audioFile = audioFile;
        this.language = language;
    }
    
    // Getters and Setters
    public String getAudioFile() {
        return audioFile;
    }
    
    public void setAudioFile(String audioFile) {
        this.audioFile = audioFile;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public Boolean getEnableTimestamps() {
        return enableTimestamps;
    }
    
    public void setEnableTimestamps(Boolean enableTimestamps) {
        this.enableTimestamps = enableTimestamps;
    }
    
    public Boolean getEnableWordTimestamps() {
        return enableWordTimestamps;
    }
    
    public void setEnableWordTimestamps(Boolean enableWordTimestamps) {
        this.enableWordTimestamps = enableWordTimestamps;
    }
    
    public Double getTemperature() {
        return temperature;
    }
    
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
}