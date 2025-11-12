package com.inksoul.exception;

/**
 * 资源未找到异常
 * 
 * @author InkSoul Team
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}