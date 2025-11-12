package com.inksoul.dto.voice;

import java.util.List;

/**
 * 语音转文字响应DTO
 * 
 * @author InkSoul Team
 */
public class TranscriptionResponse {
    
    private String text;
    private Double confidence;
    private String language;
    private Double duration;
    private List<TranscriptionSegment> segments;
    
    // Constructors
    public TranscriptionResponse() {}
    
    public TranscriptionResponse(String text, Double confidence, String language, Double duration) {
        this.text = text;
        this.confidence = confidence;
        this.language = language;
        this.duration = duration;
    }
    
    // Getters and Setters
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    public Double getConfidence() {
        return confidence;
    }
    
    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public Double getDuration() {
        return duration;
    }
    
    public void setDuration(Double duration) {
        this.duration = duration;
    }
    
    public List<TranscriptionSegment> getSegments() {
        return segments;
    }
    
    public void setSegments(List<TranscriptionSegment> segments) {
        this.segments = segments;
    }
    
    /**
     * 转录片段
     */
    public static class TranscriptionSegment {
        private String text;
        private Double start;
        private Double end;
        private Double confidence;
        
        // Constructors
        public TranscriptionSegment() {}
        
        public TranscriptionSegment(String text, Double start, Double end, Double confidence) {
            this.text = text;
            this.start = start;
            this.end = end;
            this.confidence = confidence;
        }
        
        // Getters and Setters
        public String getText() {
            return text;
        }
        
        public void setText(String text) {
            this.text = text;
        }
        
        public Double getStart() {
            return start;
        }
        
        public void setStart(Double start) {
            this.start = start;
        }
        
        public Double getEnd() {
            return end;
        }
        
        public void setEnd(Double end) {
            this.end = end;
        }
        
        public Double getConfidence() {
            return confidence;
        }
        
        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }
    }
}