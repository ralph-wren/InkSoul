package com.inksoul.exception;

/**
 * 错误请求异常
 * 
 * @author InkSoul Team
 */
public class BadRequestException extends RuntimeException {
    
    public BadRequestException(String message) {
        super(message);
    }
    
    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}