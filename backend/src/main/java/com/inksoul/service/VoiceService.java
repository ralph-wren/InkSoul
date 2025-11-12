package com.inksoul.service;

import com.inksoul.dto.voice.TranscriptionRequest;
import com.inksoul.dto.voice.TranscriptionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Map;

/**
 * 语音处理服务
 * 
 * @author InkSoul Team
 */
@Service
public class VoiceService {

    private static final Logger logger = LoggerFactory.getLogger(VoiceService.class);

    @Value("${ai.services.openai.api-key}")
    private String openaiApiKey;

    @Value("${ai.services.openai.base-url}")
    private String openaiBaseUrl;

    @Value("${ai.services.azure.speech.api-key:}")
    private String azureSpeechKey;

    @Value("${ai.services.azure.speech.region:}")
    private String azureSpeechRegion;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * 语音转文字（Base64音频）
     */
    public TranscriptionResponse transcribeAudio(TranscriptionRequest request) {
        try {
            // 将Base64音频保存为临时文件
            byte[] audioBytes = Base64.getDecoder().decode(request.getAudioFile());
            Path tempFile = createTempAudioFile(audioBytes);

            try {
                // 调用OpenAI Whisper API
                return transcribeWithOpenAI(tempFile.toFile(), request.getLanguage());
            } finally {
                // 清理临时文件
                Files.deleteIfExists(tempFile);
            }
        } catch (Exception e) {
            logger.error("语音转文字失败", e);
            throw new RuntimeException("语音转文字失败：" + e.getMessage());
        }
    }

    /**
     * 语音转文字（文件上传）
     */
    public TranscriptionResponse transcribeAudioFile(MultipartFile audioFile, String language) {
        try {
            // 保存上传的文件为临时文件
            Path tempFile = createTempAudioFile(audioFile.getBytes());

            try {
                // 调用OpenAI Whisper API
                return transcribeWithOpenAI(tempFile.toFile(), language);
            } finally {
                // 清理临时文件
                Files.deleteIfExists(tempFile);
            }
        } catch (Exception e) {
            logger.error("语音文件转文字失败", e);
            throw new RuntimeException("语音文件转文字失败：" + e.getMessage());
        }
    }

    /**
     * 使用OpenAI Whisper API进行语音转文字
     */
    private TranscriptionResponse transcribeWithOpenAI(File audioFile, String language) {
        try {
            String url = openaiBaseUrl + "/audio/transcriptions";

            // 准备请求头
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBearerAuth(openaiApiKey);

            // 准备请求体
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new org.springframework.core.io.FileSystemResource(audioFile));
            body.add("model", "whisper-1");
            body.add("language", language);
            body.add("response_format", "verbose_json");
            body.add("timestamp_granularities[]", "segment");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // 发送请求
            ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.POST, requestEntity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return parseOpenAIResponse(response.getBody());
            } else {
                throw new RuntimeException("OpenAI API调用失败");
            }
        } catch (Exception e) {
            logger.error("OpenAI Whisper API调用失败", e);
            
            // 如果OpenAI失败，尝试使用Azure Speech Services
            if (!azureSpeechKey.isEmpty()) {
                return transcribeWithAzure(audioFile, language);
            }
            
            throw new RuntimeException("语音转文字服务不可用：" + e.getMessage());
        }
    }

    /**
     * 使用Azure Speech Services进行语音转文字
     */
    private TranscriptionResponse transcribeWithAzure(File audioFile, String language) {
        try {
            // TODO: 实现Azure Speech Services集成
            // 这里是一个简化的实现，实际需要使用Azure SDK
            
            logger.warn("Azure Speech Services集成尚未实现，返回模拟结果");
            
            TranscriptionResponse response = new TranscriptionResponse();
            response.setText("Azure语音转换功能正在开发中");
            response.setConfidence(0.0);
            response.setLanguage(language);
            response.setDuration(0.0);
            
            return response;
        } catch (Exception e) {
            logger.error("Azure Speech Services调用失败", e);
            throw new RuntimeException("Azure语音转文字失败：" + e.getMessage());
        }
    }

    /**
     * 解析OpenAI API响应
     */
    private TranscriptionResponse parseOpenAIResponse(Map<String, Object> responseBody) {
        TranscriptionResponse response = new TranscriptionResponse();
        
        response.setText((String) responseBody.get("text"));
        response.setLanguage((String) responseBody.get("language"));
        
        // 获取时长
        Object duration = responseBody.get("duration");
        if (duration instanceof Number) {
            response.setDuration(((Number) duration).doubleValue());
        }
        
        // 设置默认置信度（OpenAI Whisper不直接提供整体置信度）
        response.setConfidence(0.95);
        
        // TODO: 解析segments信息
        
        return response;
    }

    /**
     * 创建临时音频文件
     */
    private Path createTempAudioFile(byte[] audioBytes) throws IOException {
        Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
        Path tempFile = Files.createTempFile(tempDir, "audio_", ".tmp");
        
        try (FileOutputStream fos = new FileOutputStream(tempFile.toFile())) {
            fos.write(audioBytes);
        }
        
        return tempFile;
    }

    /**
     * 获取支持的语言列表
     */
    public String[] getSupportedLanguages() {
        return new String[]{
            "zh-CN", "zh-TW", "en-US", "en-GB", 
            "ja-JP", "ko-KR", "fr-FR", "de-DE", 
            "es-ES", "it-IT", "pt-PT", "ru-RU"
        };
    }

    /**
     * 检查语音服务是否可用
     */
    public boolean isServiceAvailable() {
        try {
            // 检查OpenAI API密钥是否配置
            if (openaiApiKey != null && !openaiApiKey.isEmpty() && !openaiApiKey.startsWith("${")) {
                return true;
            }
            
            // 检查Azure Speech Services是否配置
            if (azureSpeechKey != null && !azureSpeechKey.isEmpty() && !azureSpeechKey.startsWith("${")) {
                return true;
            }
            
            return false;
        } catch (Exception e) {
            logger.error("检查语音服务可用性失败", e);
            return false;
        }
    }
}