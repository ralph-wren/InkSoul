package com.inksoul.controller;

import com.inksoul.dto.ApiResponse;
import com.inksoul.dto.voice.TranscriptionRequest;
import com.inksoul.dto.voice.TranscriptionResponse;
import com.inksoul.service.VoiceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;

/**
 * 语音处理控制器
 * 
 * @author InkSoul Team
 */
@RestController
@RequestMapping("/voice")
@PreAuthorize("hasRole('USER')")
public class VoiceController {

    private static final Logger logger = LoggerFactory.getLogger(VoiceController.class);

    @Autowired
    private VoiceService voiceService;

    /**
     * 语音转文字
     */
    @PostMapping("/transcribe")
    public ResponseEntity<ApiResponse<TranscriptionResponse>> transcribeAudio(
            @Valid @RequestBody TranscriptionRequest request) {
        try {
            TranscriptionResponse response = voiceService.transcribeAudio(request);
            return ResponseEntity.ok(ApiResponse.success("语音转换成功", response));
        } catch (Exception e) {
            logger.error("语音转换失败", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("语音转换失败：" + e.getMessage()));
        }
    }

    /**
     * 上传音频文件并转换
     */
    @PostMapping("/upload-and-transcribe")
    public ResponseEntity<ApiResponse<TranscriptionResponse>> uploadAndTranscribe(
            @RequestParam("audio") MultipartFile audioFile,
            @RequestParam(value = "language", defaultValue = "zh-CN") String language) {
        try {
            if (audioFile.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("音频文件不能为空"));
            }

            // 检查文件类型
            String contentType = audioFile.getContentType();
            if (contentType == null || !contentType.startsWith("audio/")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("请上传有效的音频文件"));
            }

            // 检查文件大小（限制为50MB）
            if (audioFile.getSize() > 50 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("音频文件大小不能超过50MB"));
            }

            TranscriptionResponse response = voiceService.transcribeAudioFile(audioFile, language);
            return ResponseEntity.ok(ApiResponse.success("语音转换成功", response));
        } catch (Exception e) {
            logger.error("上传并转换音频失败", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("语音转换失败：" + e.getMessage()));
        }
    }

    /**
     * 获取支持的语言列表
     */
    @GetMapping("/supported-languages")
    public ResponseEntity<ApiResponse<String[]>> getSupportedLanguages() {
        try {
            String[] languages = voiceService.getSupportedLanguages();
            return ResponseEntity.ok(ApiResponse.success(languages));
        } catch (Exception e) {
            logger.error("获取支持语言列表失败", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("获取语言列表失败：" + e.getMessage()));
        }
    }

    /**
     * 检查语音服务状态
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<String>> getServiceStatus() {
        try {
            boolean isAvailable = voiceService.isServiceAvailable();
            String status = isAvailable ? "服务正常" : "服务不可用";
            return ResponseEntity.ok(ApiResponse.success(status, status));
        } catch (Exception e) {
            logger.error("检查语音服务状态失败", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("检查服务状态失败：" + e.getMessage()));
        }
    }
}